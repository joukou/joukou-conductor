JoukouConductorExchange   = process.env["JOUKOU_CONDUCTOR_EXCHANGE"]
JoukouConductorRoutingKey = process.env["JOUKOU_CONDUCTOR_ROUTING_KEY"]

JoukouFleetAPIHost        = process.env["JOUKOU_FLEET_API_HOST"]
JoukouFleetAPIPath        = process.env["JOUKOU_FLEET_API_PATH"]

RabbitMQClient            = require('./client').RabbitMQClient
request                   = require('request')
fleet                     = require('../fleet')
noflo                     = require('../noflo/systemd')

# Set the ENV variable for next time
# This does not effect global env just this process
if not JoukouConductorExchange
  JoukouConductorExchange = "amqp://localhost"
  process.env["JOUKOU_CONDUCTOR_EXCHANGE"] = JoukouConductorExchange

if not JoukouConductorRoutingKey
  JoukouConductorRoutingKey = "CONDUCTOR"
  process.env["JOUKOU_CONDUCTOR_ROUTING_KEY"] = JoukouConductorRoutingKey

if not JoukouFleetAPIHost
  JoukouFleetAPIHost = "localhost:4002"
  process.env["JOUKOU_FLEET_API_HOST"] = JoukouFleetAPIHost

if not JoukouFleetAPIPath
  JoukouFleetAPIPath = "/v1-alpha/"
  process.env["JOUKOU_FLEET_API_PATH"] = JoukouFleetAPIPath

class ConductorRabbitMQClient extends RabbitMQClient
  fleetClient: null
  constructor: ->
    super(JoukouConductorExchange, JoukouConductorRoutingKey)
    client = this
    this.consume( ->
      client.onMessage.apply(client, arguments)
    , yes)
    this.fleetClient = fleet.getClient(
      JoukouFleetAPIHost,
      JoukouFleetAPIPath,
      yes
    )
  onMessage: (message) ->
    # Here we must process what the peeps
    # want their graphs to do
    # Here is an example of messages from Isaac:
    # {
    #  "_links": {
    #    "joukou:graph": {
    #      "href":
    #         "http://api.joukou.local:2101/persona/personaUuid/graph/graphUuid"
    #    }
    #  },
    #  "desiredState": "launched", // or "inactive"
    #  "secret": "json-web-token"
    #}
    # No one is listening for errors so just return
    # if there is something missing
    if message not instanceof Object
      return
    if message["_links"] not instanceof Object
      return
    if message["_links"]["joukou:graph"] not instanceof Object
      return
    if not message["_links"]["joukou:graph"]["href"]
      return
    if not message.desiredState
      return
    #May be a public graph, we will try without this
    #if not message.secret
    #  return
    this.onGraphHref(
      message["_links"]["joukou:graph"]["href"],
      message.desiredState,
      message.secret
    )
  onGraphHref: (graphHref, desiredState, secret) ->
    options = null
    if secret
      options =
        headers:
          Authorization: "Bearer #{secret}"
    client = this
    request.get(graphHref, options, (error, response, body, desiredState) ->
      client.onGraphResponse.apply(client, [
        error,
        response,
        body,
        desiredState
      ])
    )
  onGraphResponse: (error, response, body, desiredState) ->
    if error or response.statusCode isnt 200
      return
    jsonBody = null
    try
      jsonBody = JSON.parse(body)
    if not jsonBody
      return
    try
      this.onGraphBody(jsonBody, desiredState)
  onGraphBody: (body, desiredState) ->
    # TODO Err do stuff now?
    # Im expecting this is along the lines of
    # what is gonna happen
    options = noflo.createFromSchema(
      body,
      "TODO",
      "TODO",
      "TODO"
    )
    # noflo.createFromSchema returns something like
    ###
      unitName: "name"
      options: [SystemDUnitFile].options
      machineID: machineID
    ###
    client = this.fleetClient
    client.createUnit(
      options.unitName,
      options.options,
      desiredState,
      null,
      options.machineID
    )
module.exports =
  listen: ->
    new ConductorRabbitMQClient()
  ConductorRabbitMQClient: ConductorRabbitMQClient

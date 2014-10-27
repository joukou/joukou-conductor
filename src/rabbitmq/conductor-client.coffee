JoukouConductorExchange   = process.env["JOUKOU_CONDUCTOR_EXCHANGE"]
JoukouConductorRoutingKey = process.env["JOUKOU_CONDUCTOR_ROUTING_KEY"]
RabbitMQClient            = require('./client').RabbitMQClient

# Set the ENV variable for next time
# This does not effect global env just this process
if not JoukouConductorExchange
  JoukouConductorExchange = "amqp://localhost"
  process.env["JOUKOU_CONDUCTOR_EXCHANGE"] = JoukouConductorExchange

if not JoukouConductorRoutingKey
  JoukouConductorRoutingKey = "CONDUCTOR"
  process.env["JOUKOU_CONDUCTOR_ROUTING_KEY"] = JoukouConductorRoutingKey

class ConductorRabbitMQClient extends RabbitMQClient
  constructor: ->
    super(JoukouConductorExchange, JoukouConductorRoutingKey)
    client = this
    this.consume( ->
      client._consume.apply(client, arguments)
    , true)
  _consume: (message) ->

singleton = null
module.exports =
  listen: ->
    new ConductorRabbitMQClient()
  ConductorRabbitMQClient: ConductorRabbitMQClient

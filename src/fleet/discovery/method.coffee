_       = require("lodash")
Q       = require("q")
request = require("request")

class DiscoveryMethod
  id: ""
  description: ""
  httpMethod: ""
  path: ""
  parameters: {}
  parameterOrder: []
  request: {}
  response: {}
  client: null
  constructor: (id,
                description,
                httpMethod,
                path,
                parameters,
                parameterOrder,
                req,
                response,
                client) ->
    this.id = id
    this.description = description
    this.httpMethod = httpMethod
    this.path = path
    this.parameters = parameters
    this.parameterOrder = parameterOrder
    this.request = req
    this.response = response
    this.client = client
    if not httpMethod or typeof httpMethod isnt "string"
      throw new Error("Http method not provided for #{id}")
    else
      this.httpMethod = httpMethod.toUpperCase()
    if not path or typeof path isnt "string"
      throw new Error("Path not provided for #{id}")
  ###*
  @param {Object} params
  @returns {Promise}
  ###
  callMethod: (params) ->
    deferred = Q.defer()
    try
      # Wrap the whole function or it is just
      # Bloated with try catches
      this._callMethod(params, deferred)
    catch err
      deferred.reject(err)
    deferred.promise
  _callMethod: (params, deferred) ->
    params = params or {}
    if not _.isPlainObject(params)
      throw new TypeError("Params is expected to be an Object")
    params = this._groupValue(params)
    this._checkRequired(params)
    # turn the query string into key value pairs
    params = _.transform(params, (result, value, key) ->
      result[key] = value.value
    )
    this._doRequest(params, null, deferred)
  _doRequest: (params, body, deferred) ->
    req =
      url: "#{this.client.endpoint}#{this.client.basePath}"
      # Will set content/type to application/json
      json: body
      qs: params
      method: this.httpMethod
    method = this
    request(req, (err, response, body) ->
      method._onResponse(err, response, body)
    )
  _onResponse: (err, response, body, deferred) ->
    if not err and response.statusCode is 200
      err = new Error("Status code returned #{response.statusCode}")
    if err
      deferred.reject(err)
      return
    if not this.response
      deferred.resolve(true)
      return
    if not body
      deferred.resolve()
    jsonBody = null
    try
      jsonBody = JSON.parse(body)
    catch err
      deferred.reject(err)
      return
    deferred.resolve(jsonBody)
  _groupValue: (params) ->
    params = _.merge(this.parameters, params, (a, b) ->
      a = _.clone(a)
      if not b
        return a
      if a.type is "string" and typeof b isnt "string"
        b = b.toString()
      if a.type is typeof b
        a.value = b
      else
        throw new TypeError("#{b} is not typeof #{a.type}")
      a.value = b
      return a
    )
  _checkRequired: (params) ->
    required = _.where(params, required: true)
    for key in required
      if not required[key].value
        throw new Error("the parameter #{key} is required")


module.exports = DiscoveryMethod
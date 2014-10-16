_               = require("lodash")
Q               = require("q")
request         = require("request")
DiscoverySchema = require("./schema")

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
    return deferred.promise
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
  _doRequest: (params, requestBody, deferred, previousRequest) ->
    currentRequest = null
    if not previousRequest
      currentRequest =
        url: "#{this.client.endpoint}#{this.client.basePath}#{this.path}"
        # Will set content/type to application/json
        json: requestBody
        qs: params
        method: this.httpMethod
    else
      currentRequest = previousRequest
    method = this
    request(currentRequest, (error, response, body) ->
      method._onResponse(error, response, body, deferred, currentRequest)
    )
  _onResponse: (err, response, body, deferred, currentRequest) ->
    if not err and (response.statusCode < 200 or response.statusCode >= 300)
      # TODO Implement redirection 301, 302[, 303], 304
      err = new Error("Status code returned #{response.statusCode}")
    if err
      deferred.reject(err)
      return
    if not body and this.httpMethod isnt "GET"
      deferred.resolve()
      return
    else if not body
      deferred.reject(new Error("No body"))
      return
    jsonBody = null
    try
      jsonBody = JSON.parse(body)
    catch err
      deferred.reject(err)
      return
    if this.response instanceof Object and this.response.$ref
      this._resolveWithSchemaResponse(jsonBody, deferred, currentRequest)
    else
      deferred.resolve(jsonBody)
  _resolveWithSchemaResponse: (jsonBody, deferred, currentRequest) ->
    schema = this.client.getSchema(this.response.$ref)
    # No schema, no check
    if not schema
      return deferred.resolve(jsonBody)
    # If response should never contain nextPageToken
    if not schema.properties["nextPageToken"]
      return deferred.resolve(jsonBody)
    # There should be one other property of type array
    key = null
    for testKey of schema.properties
      if not schema.properties.hasOwnProperty(testKey)
        continue
      if testKey isnt "nextPageToken"
        key = testKey
    if not key
      return deferred.resolve(jsonBody)
    if schema.properties[key].type isnt "array"
      # TODO implement for objects
      return deferred.resolve(jsonBody)
    # This should be an array
    values = jsonBody[key]
    # If not throw it away
    if not _.isArray(values)
      return deferred.resolve(jsonBody)
    if not jsonBody["nextPageToken"]
      # Only return to the user the values
      return deferred.resolve(values)
    # Modify the existing query string or create it
    currentRequest.qs = currentRequest.qs or {}
    currentRequest.qs["nextPageToken"] = jsonBody["nextPageToken"]
    childDeferred = Q.defer()
    this._doRequest(null, null, childDeferred, currentRequest)
    childDeferred.promise.then((childValues) ->
      deferred.resolve(values.concat(childValues))
    ).fail( ->
      # TODO do something in this case where the next page
      # fails, for now return
      deferred.resolve(values)
    )

  _groupValue: (params) ->
    params = _.merge(this.parameters, params, (a, b) ->
      a = _.clone(a)
      if not b
        return a
      if a.type is "string" and typeof b isnt "string"
        b = b.toString()
      if DiscoverySchema.checkType(b, a.type)
        a.value = b
      else
        if typeof b is "string"
          b = "'#{b}'"
        throw new TypeError("#{b} is not typeof #{a.type}")
      a.value = b
      return a
    )
  _checkRequired: (params) ->
    for key of params
      val = params[key]
      if not val.required
        continue
      if not val.value
        throw new Error("the parameter #{key} is required")


module.exports = DiscoveryMethod
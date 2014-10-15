Q                 = require("q")
request           = require("request")
DiscoveryResource = require("./resource")
DiscoveryMethod   = require("./method")
_                 = require("lodash")

class DiscoveryClient
  # START Values from discovery.json
  kind: ""
  discoveryVersion: ""
  id: ""
  name: ""
  version: ""
  title: ""
  description: ""
  documentLink: ""
  protocol: ""
  baseUrl: ""
  basePath: ""
  rootUrl: ""
  servicePath: ""
  batchPath: ""
  endpoint: ""
  resources: {}
  schemas: {}
  # END Values from discover.json
  # START "Private" variables
  _complete: false
  _error: null
  _discovering: false
  _resolveOnDiscovery: []
  _request: request
  # END "Private" variables
  ###*
  @param {string} endpoint
  @param {string} [basePath='/v1-alpha/']
  @param {boolean} [doDiscovery=false]
  ###
  constructor: (endpoint, basePath, doDiscovery) ->
    this.endpoint = endpoint
    this.basePath = basePath
    this._validateEndpoint()
    if doDiscovery
      this.doDiscovery()
  _validateEndpoint: ->
    if not this.endpoint
      throw new Error("Endpoint is required")
    if typeof this.endpoint isnt "string"
      throw new TypeError("Endpoint is expected to be a string")
    if this.basePath is null or this.basePath is undefined
      this.basePath = "/v1-alpha/"
    else if typeof this.basePath isnt "string"
      throw new TypeError("Base path is expected to be a string")
    if this._lastCharacter(this.endpoint) is "/"
      this.endpoint = this._stripLastCharacter(this.endpoint)
    # Ensure basePath has at least "/"
    # or is "/#{path}/"
    if this._firstCharacter(this.basePath) isnt "/"
      this.basePath = "/#{this.basePath}"
    if this._lastCharacter(this.basePath) isnt "/"
      this.basePath = "#{this.basePath}/"
  _stripLastCharacter: (str) ->
    if not str or typeof str isnt "string"
      return ""
    length = str.length
    str.substring(0, length - 2)
  _firstCharacter: (str) ->
    if not str or typeof str isnt "string"
      return null
    return str.substring(0, 1)
  _lastCharacter: (str) ->
    if not str or typeof str isnt "string"
      return null
    length = str.length
    str.substring(length - 1, length)
  doDiscovery: ->
    deferred = Q.defer()
    if this._complete
      if this._error
        deferred.reject(this._error)
      else
        deferred.resolve(this)
      return deferred.promise
    this._resolveOnDiscovery.push(deferred)
    if this._discovering
      return deferred.promise
    this._discovering = true
    this._doDiscoveryRequest()
    deferred.promise
  _doDiscoveryRequest: ->
    client = this
    this._request.get(
      "#{this.endpoint}#{this.basePath}discovery.json",
    (error, response, body) ->
      client._onDiscoveryResult(error, response, body)
    )
  _rejectWithError: (error) ->
    this._error = error
    this._complete = true
    this._discovering = false
    for i in this._resolveOnDiscovery
      i.reject(error)
    this._resolveOnDiscovery = []
  _resolve: ->
    this._error = null
    this._complete = true
    this._discovering = false
    for i in this._resolveOnDiscovery
      i.resolve(this)
    this._resolveOnDiscovery = []
  _onDiscoveryResult: (error, response, body) ->
    if not error and response.statusCode isnt 200
      error = new Error("Failed to get discovery.json")
    if not error and not body
      error = new Error("Discovery body is empty")
    if error
      this._rejectWithError(error)
      return
    jsonBody = null
    try
      jsonBody = JSON.parse(body)
    catch err
      this._rejectWithError(err)
      return
    if not _.isPlainObject(jsonBody)
      this._rejectWithError(new Error("discovery.json body not an object"))
      return
    try
      this.resources = this._resolveDiscovery(jsonBody)
    catch err
      this._rejectWithError(err)
      return
    this._resolve()
  onDiscovery: ->
    deferred = Q.defer()
    if this._complete
      if this._error
        deferred.reject(this._error)
      else
        deferred.resolve(this)
    else if this._discovering
      this._resolveOnDiscovery.push(deferred)
    deferred.promise
  _attachResources: ->
    for key of this.resources
      if not this.resources.hasOwnProperty(key)
        continue
      this[key] = this.resources[key]
  _resolveDiscovery: (discovery) ->
    if not discovery or not _.isPlainObject(discovery)
      throw new TypeError("Discovery not instanceof an object")
    this._resolveResources(discovery.resources)
  _resolveResources: (resources) ->
    if not _.isPlainObject(resources)
      throw new TypeError("Resources not an object")
    resultResources = {}
    for resourceName of resources
      if not resources.hasOwnProperty(resourceName)
        continue
      resource = this._resolveResource(resourceName, resources[resourceName])
      if resource
        resultResources[resourceName] = resource
    resultResources
  _resolveResource: (resourceName, resource) ->
    if not _.isPlainObject(resource) or not _.isPlainObject(resource.methods)
      return null
    methods = {}
    for methodName of resource.methods
      if not resource.methods.hasOwnProperty(methodName)
        continue
      method = null
      try
        method = this._resolveMethod(methodName, resource.methods[methodName])
      catch
        continue
      if method
        methods[methodName] = method
    new DiscoveryResource(resourceName, methods, this)
  _resolveMethod: (methodName, method) ->
    if not _.isPlainObject(method)
      return null
    new DiscoveryMethod(
      method.id,
      method.description,
      method.httpMethod,
      method.path,
      method.parameters,
      method.parameterOrder,
      method.request,
      method.response,
      this
    )
  _resolveSchemas: (schemas) ->
    if not _.isPlainObject(schemas)
      throw new TypeError("Schemas not an object")
    resultSchemas = {}
    for schemaName of schemas
      if not schemas.hasOwnProperty(schemaName)
        continue

    resultSchemas
  _resolveSchema: (schemaName, schema) ->

  getSchema: (name) ->
    return this.schema[name]
  hasSchema: (name) ->
    return !!this.schemas[name]
  getResource: (name) ->
    return this.resources[name]
  hasResource: (name) ->
    return !!this.resources[name]


module.exports =
  ###*
  @param {string} endpoint
  @param {string} [basePath='/v1-alpha/']
  @param {boolean} [doDiscovery=false]
  ###
  getClient: (endpoint, basePath, doDiscovery) ->
    new DiscoveryClient(endpoint, basePath, doDiscovery)

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
  # END Values from discover.json
  # START "Private" variables
  _complete: false
  _error: null
  _discovering: false
  _resolveOnDiscovery: []
  # END "Private" variables
  ###*
  @param {string} endpoint
  ###
  constructor: (endpoint, basePath) ->
    this.endpoint = endpoint
    if not endpoint
      throw new Error("Endpoint is required")
    this.basePath = basePath
    if this.basePath is null or this.basePath is undefined
      this.basePath = "/v1-alpha/"
  doDiscovery: ->
    deferred = Q.defer()
    if this._complete
      deferred.resolve(this)
      return deferred.promise
    this._resolveOnDiscovery.push(deferred)
    if this._discovering
      return deferred.promise
    this._discovering = true
    this._doDiscoveryRequest()
    deferred.promise
  _doDiscoveryRequest:  ->
    client = this
    request.get(
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
  _resolveDiscovery: (discovery) ->
    if not discovery or not _.isPlainObject(discovery)
      throw new Error("Discovery not instanceof an object")
    this._resolveResources(discovery.resources)
  _resolveResources: (resources) ->
    if not _.isPlainObject(resources)
      throw new Error("Resources not an object")
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
      method = this._resolveMethod(resource.methods[methodName])
      if method
        methods[methodName] = method
    new DiscoveryResource(resourceName, methods)
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
      method.response
    )

module.exports =
  ###*
  @param {string} endpoint
  ###
  getClient: (endpoint, basePath) ->
    new DiscoveryClient(endpoint, basePath)

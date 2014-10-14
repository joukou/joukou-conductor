Q                 = require("q")
request           = require("request")
DiscoveryResource = require("./resource")
DiscoveryMethod   = require("./method")

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
  resources: []
  # END Values from discover.json
  complete: false
  error: null
  discovering: false
  resolveOnDiscovery: []
  ###*
  @param {string} endpoint
  ###
  constructor: (endpoint, basePath) ->
    this.endpoint = endpoint
    if not endpoint
      throw new Error("Endpoint is required")
    this.basePath = basePath
    if this.basePath is null
      this.basePath = "/v1-alpha/"
  doDiscovery: ->
    deferred = Q.defer()
    if this.complete
      deferred.resolve(this)
      return deferred.promise
    this.resolveOnDiscovery.push(deferred)
    if this.discovering
      return deferred.promise
    this.discovering = true
    client = this
    request.get(
      "#{this.endpoint}#{this.basePath}discovery.json",
      (error, response, body) ->
        rejectWithError = (rejectError) ->
          client.error = rejectError
          client.complete = true
          client.discovering = false
          for i in client.resolveOnDiscovery
            i.reject(rejectError)
          client.resolveOnDiscovery = []

        if response.statusCode isnt 200
          error = new Error("Failed to get discovery.json")
        if error
          rejectWithError(error)
          return
        jsonBody = null
        try
          jsonBody = JSON.parse(body)
        catch
          rejectWithError(error)
          return
        if not jsonBody
          rejectWithError(new Error("discovery.json body empty"))
          return
        try
          client.resolveDiscovery(jsonBody)
        catch err
          rejectWithError(err)
          return
        client.error = null
        client.complete = true
        client.discovering = false
        for i in client.resolveOnDiscovery
          i.resolve(client)
        client.resolveOnDiscovery = []
    )
    deferred.promise;
  onDiscovery: ->
    deferred = Q.defer()
    if this.complete
      if this.error
        deferred.reject(this.error)
      else
        deferred.resolve(this)
    else if this.discovering
      this.resolveOnDiscovery.push(deferred)
    deferred.promise
  resolveDiscovery: (discovery) ->
    if discovery not instanceof Object
      throw new Error("Discovery not instanceof an object")
    resources = {}
    if discovery.resources instanceof Object
      for resourceName of discovery.resources
        if not discovery.resources.hasOwnProperty(resourceName)
          continue
        resource = discovery.resources[resourceName]
        if resource.methods not instanceof Object
          continue
        methods = {}
        for methodName of resource.methods
          if not resource.methods.hasOwnProperty(methodName)
            continue
          method = resource.methods[methodName]
          if method not instanceof Object
            continue
          methods[methodName] = new DiscoveryMethod(
            method.id,
            method.description,
            method.httpMethod,
            method.path,
            method.parameters,
            method.parameterOrder,
            method.request,
            method.response
          )
        resources[resourceName] = new DiscoveryResource(resourceName, methods)
    this.resources = resources
    resources


module.exports =
  ###*
  @param {string} endpoint
  ###
  getClient: (endpoint) ->
    new DiscoveryClient(endpoint)

Q       = require("q")
request = require("request")

class DiscoveryMethod
  constructor: (id,
                description,
                httpMethod,
                path,
                parameters,
                parameterOrder,
                response) ->


class DiscoveryResource
  ###*
  @param {string} name
  @param {Array.<DiscoveryMethod>} methods
  ###
  constructor: (name, methods) ->

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
    self.endpoint = endpoint
    if not endpoint
      throw new Error("Endpoint is required")
    self.basePath = basePath
    if self.basePath is null
      self.basePath = "/v1-alpha/"
  doDiscovery: ->
    deferred = Q.defer()
    if self.complete
      deferred.resolve(self)
      return deferred.promise
    self.resolveOnDiscovery.push(deferred)
    if self.discovering
      return deferred.promise
    self.discovering = true
    client = self
    request.get(
      "#{self.endpoint}#{self.basePath}discovery.json",
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
    if self.complete
      if self.error
        deferred.reject(self.error)
      else
        deferred.resolve(self)
    else if self.discovering
      self.resolveOnDiscovery.push(deferred)
    deferred.promise
  resolveDiscovery: (discovery) ->


module.exports =
  ###*
  @param {string} endpoint
  ###
  getClient: (endpoint) ->
    new DiscoveryClient(endpoint)

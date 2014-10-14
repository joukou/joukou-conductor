clientModule      = require( '../../../dist/fleet/discovery/client' )
assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect

discovery =
  resources:
    resource:
      methods:
        get:
          id: "get"
          description: "get"
          httpMethod: "GET"
          path: "resource"
          parameters:
            name:
              type: "string"
              location: "query"

describe "client", ->
  specify "exists", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    expect(client).to.exist

  specify "fails when no endpoint", ->
    expect(clientModule.getClient).to.Throw(Error, "Endpoint is required")

  specify "uses endpoint", ->
    endpoint = "localhost:10000"
    client = clientModule.getClient(endpoint, "/v1-alpha/")
    expect(client.endpoint).to.equal(endpoint)

  specify "uses path", ->
    path = "/v2-alpha/"
    client = clientModule.getClient("localhost:4002", path)
    expect(client.basePath).to.equal(path)

  specify "resolves when no path", ->
    client = clientModule.getClient("localhost:4002")
    expect(client.basePath).to.equal("/v1-alpha/")

  specify "discovery fails", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    expect(client._resolveDiscovery).to.Throw(Error)

  specify "discovery resolves resources", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resources = client._resolveDiscovery(
      discovery
    )
    expect(resources, "resources").to.exist
    expect(resources).to.be.instanceof(Object)

  specify "resolves resources", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resources = client._resolveResources(discovery.resources)
    expect(resources).to.exist
    expect(resources).to.be.instanceof(Object)
    expect(resources).to.include.key("resource")

  specify "doesn't prototyped values", ->
    Object.prototype.randomFunction = ->
      true
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resources = client._resolveResources({})
    expect(resources).to.not.include.key("randomFunction")

  specify "doesn't resolve resources if undefined", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    expect(client._resolveResources).to.throw(Error)

  specify "resolves first resource", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resources = client._resolveResources(discovery.resources)
    expect(resources.resource).to.exist
    expect(resources.resource).to.be.instanceof(Object)

  specify "resolves resource methods", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resource = client._resolveResource("resource", discovery.resources.resource)
    expect(resource).to.include.key("methods")
    expect(resource.methods).to.exist
    expect(resource.methods).to.be.instanceof(Object)

  specify "doesn't resolves resource", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resource = client._resolveResource("resource", null)
    expect(resource).to.not.exist

  specify "resolves get method", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    method = client._resolveMethod("get", discovery.resources.resource.methods.get)
    expect(method).to.exist
    expect(method).to.be.instanceof(Object)

  specify "resolves get method from resource", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resource = client._resolveResource("resource", discovery.resources.resource)
    expect(resource.methods).to.include.key("get")

  specify "doesn't resolve test method from resource", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resource = client._resolveResource("resource", {
      methods:
        test: null
    })
    expect(resource.methods).to.not.include.key("test")

  specify "resolves get method id", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    method = client._resolveMethod("get", discovery.resources.resource.methods.get)
    expect(method.id).to.equal("get")

  specify "not resolve method id", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    method = client._resolveMethod("get", {})
    expect(method.id).to.not.equal("get")

  specify "on discovery resolves", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promise = client.onDiscovery()
    promise.should.eventually.equal(client)
    client._resolve()

  specify "on discovery reject", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promise = client.onDiscovery()
    message = "Test"
    client._rejectWithError(new Error(message))
    promise.should.eventually.be.rejectedWith(Error, message)

  specify "on discovery multiple resolves", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promiseA = client.onDiscovery()
    promiseB = client.onDiscovery()
    promiseA.should.eventually.equal(client)
    promiseB.should.eventually.equal(client)
    client._resolve()

  specify "on discovery resolve after", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    client._resolve()
    promise = client.onDiscovery()
    promise.should.eventually.equal(client)

  specify "on discovery reject after", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    message = "Test"
    client._rejectWithError(new Error(message))
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, message)

  specify "discovery response status code not 200", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:404})
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "Failed to get discovery.json")

  specify "discovery response has error", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    message = "Test"
    client._onDiscoveryResult(new Error(message), {statusCode:200})
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, message)

  specify "discovery response has no body", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, null)
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "Discovery body is empty")

  specify "discovery response has body", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, JSON.stringify(discovery))
    promise = client.onDiscovery()
    promise.should.eventually.equal(client)

  specify "discovery response has broken body (Array)", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, "[]")
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "discovery.json body not an object")

  specify "discovery response has broken body (date)", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, new Date())
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error)

  specify "discovery response has broken body (no resources)", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, "{}")
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "Resources not an object")

  specify "do discovery", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._request.get = (url, callback) -> callback(null, { statusCode: 200 }, JSON.stringify(discovery))
    promise = client.doDiscovery()
    promise.should.eventually.equal(client)

  specify "do discovery after resolve", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._resolve()
    promise = client.doDiscovery()
    promise.should.eventually.equal(client)

  specify "do discovery after reject", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    message = "Test"
    client._rejectWithError(new Error(message))
    promise = client.doDiscovery()
    promise.should.eventually.be.rejectedWith(Error, message)

  specify "do discovery while discovering", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promise = client.doDiscovery()
    promise.should.eventually.equal(client)
    client._resolve()




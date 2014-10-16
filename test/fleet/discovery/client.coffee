proxyquire        = require("proxyquire")

clientModule      = require( '../../../dist/fleet/discovery/client')
assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect

discovery =
  schemas:
    UnitPage:
      type: "object"
      properties:
        units:
          type: "array"
          items:
            $ref: "Unit"
        nextPageToken:
          type: 'string'
    Unit:
      type: "object"
      properties:
        name:
          type:"string"
          required:true
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

  specify "fails when endpoint wrong type", ->
    expect(->
      clientModule.getClient(1)
    ).to.Throw(TypeError, "Endpoint is expected to be a string")

  specify "fails when basePath wrong type", ->
    expect(->
      clientModule.getClient("test", 1)
    ).to.Throw(TypeError, "Base path is expected to be a string")

  specify "uses endpoint", ->
    endpoint = "localhost:10000"
    client = clientModule.getClient(endpoint, "/v1-alpha/")
    expect(client.endpoint).to.equal(endpoint)

  specify "removes trailing slash from endpoint", ->
    endpoint = "localhost:10000"
    client = clientModule.getClient(endpoint + "/")
    expect(client.endpoint).to.equal(endpoint)

  specify "uses path", ->
    path = "/v2-alpha/"
    client = clientModule.getClient("localhost:4002", path)
    expect(client.basePath).to.equal(path)

  specify "adds leading slash to path", ->
    path = "v2-alpha/"
    client = clientModule.getClient("localhost:4002", path)
    expect(client.basePath).to.equal("/" + path)

  specify "adds trailing slash to path", ->
    path = "/v2-alpha"
    client = clientModule.getClient("localhost:4002", path)
    expect(client.basePath).to.equal(path + "/")

  specify "adds trailing and leading slash to path", ->
    path = "v2-alpha"
    client = clientModule.getClient("localhost:4002", path)
    expect(client.basePath).to.equal("/" + path + "/")

  specify "sets path to slash", ->
    path = ""
    client = clientModule.getClient("localhost:4002", path)
    expect(client.basePath).to.equal("/")

  specify "split last characters returns empty string", ->
    client = clientModule.getClient("test")
    expect(client._stripLastCharacter(1)).to.equal("")

  specify "split last characters returns null", ->
    client = clientModule.getClient("test")
    expect(client._lastCharacter(1)).to.equal(null)

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

  specify "fails to resolve if no httpMethod", ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    resource = client._resolveResource("resource", {
      methods:
        get:
          id: "get"
    })
    expect(resource.methods).to.not.include.key("get")

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
    method = client._resolveMethod("get", {httpMethod:"GET", path:"TEST"})
    expect(method.id).to.not.equal("get")

  specify "on discovery resolves", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promise = client.onDiscovery()
    promise.should.eventually.equal(client).notify(done)
    client._resolve()

  specify "on discovery reject", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promise = client.onDiscovery()
    message = "Test"
    client._rejectWithError(new Error(message))
    promise.should.eventually.be.rejectedWith(Error, message).notify(done)

  specify "on discovery multiple resolves", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promiseA = client.onDiscovery()
    promiseB = client.onDiscovery()
    promiseA.should.eventually.equal(client)
      .notify(->
      promiseB.should.eventually.equal(client).notify(done)
    )
    client._resolve()

  specify "on discovery resolves if not started discovery", (done) ->
    localClientModule = proxyquire( '../../../dist/fleet/discovery/client', {
      request:
        get: (url, callback) ->
          callback(null, { statusCode: 200 }, JSON.stringify(discovery))
    })
    client = localClientModule.getClient("localhost:4002", "/v1-alpha/")
    promise = client.onDiscovery()
    promise.should.eventually.equal(client).notify(done)

  specify "on discovery resolves after", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    client._resolve()
    promise = client.onDiscovery()
    promise.should.eventually.equal(client).notify(done)

  specify "on discovery rejects after", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    message = "Test"
    client._rejectWithError(new Error(message))
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, message).notify(done)

  specify "discovery response status code not 200", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:404})
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "Failed to get discovery.json").notify(done)

  specify "discovery response has error", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    message = "Test"
    client._onDiscoveryResult(new Error(message), {statusCode:200})
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, message).notify(done)

  specify "discovery response has no body", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, null)
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "Discovery body is empty").notify(done)

  specify "discovery response has body", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, JSON.stringify(discovery))
    promise = client.onDiscovery()
    promise.should.eventually.equal(client).notify(done)

  specify "discovery response has broken body (Array)",(done)  ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, "[]")
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "discovery.json body not an object").notify(done)

  specify "discovery response has broken body (date)", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, new Date())
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error).notify(done)

  specify "discovery response has broken body (no resources)",(done)  ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._onDiscoveryResult(null, {statusCode:200}, "{}")
    promise = client.onDiscovery()
    promise.should.eventually.be.rejectedWith(Error, "Resources not an object").notify(done)

  specify "do discovery", (done) ->
    localClientModule = proxyquire( '../../../dist/fleet/discovery/client', {
      request:
        get: (url, callback) ->
          callback(null, { statusCode: 200 }, JSON.stringify(discovery))
    })
    client = localClientModule.getClient("localhost:4002", "/v1-alpha/")
    promise = client.doDiscovery()
    promise.should.eventually.equal(client).notify(done)

  specify "do discovery after resolve", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._resolve()
    promise = client.doDiscovery()
    promise.should.eventually.equal(client).notify(done)

  specify "do discovery after reject", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    message = "Test"
    client._rejectWithError(new Error(message))
    promise = client.doDiscovery()
    promise.should.eventually.be.rejectedWith(Error, message).notify(done)

  specify "do discovery while discovering", (done) ->
    client = clientModule.getClient("localhost:4002", "/v1-alpha/")
    client._discovering = true
    promise = client.doDiscovery()
    promise.should.eventually.equal(client).notify(done)
    client._resolve()

  specify "do discovery in constructor", (done) ->
    localClientModule = proxyquire( '../../../dist/fleet/discovery/client', {
      request:
        get: (url, callback) ->
          callback(null, { statusCode: 200 }, JSON.stringify(discovery))
    })
    client = localClientModule.getClient("localhost:4002", "/v1-alpha/", true)
    expect(client._discovering or client._complete).to.be.ok
    promise = client.doDiscovery()
    promise.should.eventually.equal(client).notify(done)

  specify "has schema returns true", ->
    client = clientModule.getClient("localhost:4002")
    client.schemas = {
      test: "RANDOM"
    }
    expect(client.hasSchema("test")).to.be.ok

  specify "get schema returns schema", ->
    client = clientModule.getClient("localhost:4002")
    client.schemas = {
      test: "RANDOM"
    }
    expect(client.getSchema("test")).to.equal(client.schemas.test)

  specify "has resource returns true", ->
    client = clientModule.getClient("localhost:4002")
    client.resources = {
      test: "RANDOM"
    }
    expect(client.hasResource("test")).to.be.ok

  specify "get resource returns resource", ->
    client = clientModule.getClient("localhost:4002")
    client.resources = {
      test: "RANDOM"
    }
    expect(client.getResource("test")).to.equal(client.resources.test)

  specify "resolve schema fails when not object", ->
    client = clientModule.getClient("localhost:4002")
    expect(client._resolveSchema("name", 1)).to.equal(null)

  specify "resolve schema returns schema", ->
    client = clientModule.getClient("localhost:4002")
    schema = client._resolveSchema("name", {
      id: "test"
      type: "string"
    })
    expect(schema).to.exist
    expect(schema).to.be.instanceof(Object)
    expect(schema).to.include.key("id")
    expect(schema.id).to.equal("test")
    expect(schema.type).to.equal("string")

  specify "resolve schemas throws error when not object", ->
    client = clientModule.getClient("localhost:4002")
    expect(client._resolveSchemas).to.Throw(TypeError, "Schemas not an object")

  specify "resolve schemas returns expected", ->
    client = clientModule.getClient("localhost:4002")
    schemas = client._resolveSchemas(
      schema:
        id: "schema"
        type: "string"
    )
    expect(schemas).to.include.key("schema")
    expect(schemas.schema.id).to.equal("schema")
    expect(schemas.schema.type).to.equal("string")

  specify "schema doesn't resolve with no type", ->
    client = clientModule.getClient("localhost:4002")
    schemas = client._resolveSchemas(
      schema:
        id: "schema"
    )
    expect(schemas).to.not.include.key("schema")

  specify "resource doesn't resolve if not an object", ->
    client = clientModule.getClient("localhost:4002")
    resources = client._resolveResources(
      resource: 1
    )
    expect(resources).to.not.include.key("resource")

  specify "schema doesn't resolve if not an object", ->
    client = clientModule.getClient("localhost:4002")
    schemas = client._resolveSchemas(
      schema: 1
    )
    expect(schemas).to.not.include.key("schema")






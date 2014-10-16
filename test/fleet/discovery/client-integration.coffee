clientModule      = require( '../../../dist/fleet/discovery/client')
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect
restify           = require('restify')
request           = require('request')

discovery =
  schema:
    UnitPage:
      type: "object"
      properties:
        units:
          type: "array"
          items:
            $ref: "Unit"
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


basePath = "/v1-alpha/"
port = 8080

startServer = (callback) ->
  server = restify.createServer()
  server.get("#{basePath}discovery.json", (res, req, next) ->
    req.send(discovery)
    next()
  )
  server.get("#{basePath}resource", (req, res, next) ->
    res.send(resource: true)
    next()
  )
  server.listen(port, ->
    callback(server)
  )

asyncServer = (callback, done) ->
  startServer((server) ->
    callback(->
      server.close(done)
    , server)
  )

describe "client integration tests", ->
  specify "request succeeds", (done) ->
    asyncServer((actuallyDone, server)->
      request.get("#{server.url}#{basePath}discovery.json", (err, res, body) ->
        expect(err).to.not.exist
        expect(res.statusCode).to.equal(200)
        expect(body).to.equal(JSON.stringify(discovery))
        actuallyDone()
      )
    , done)

  specify "discovery json is resolved", (done) ->
    asyncServer((actuallyDone, server)->

      client = clientModule.getClient(server.url, basePath, true)
      expect(client.onDiscovery()).to.eventually.equal(client).notify(actuallyDone)

    , done)
  specify "resources are resolved", (done) ->
    asyncServer((actuallyDone, server)->

      client = clientModule.getClient(server.url, basePath, true)
      client.onDiscovery().then(->
        expect(client).to.include.key("resource")
      ).then(actuallyDone)

    , done)

  specify "methods are resolved", (done) ->
    asyncServer((actuallyDone, server)->

      client = clientModule.getClient(server.url, basePath, true)
      client.onDiscovery().then(->
        expect(client.resource).to.include.key("get")
        expect(client.resource.get).to.be.instanceof(Function)
      ).then(actuallyDone)

    , done)


  specify "methods are called", (done) ->
    this.timeout(3000)

    asyncServer((actuallyDone, server)->

      client = clientModule.getClient(server.url, basePath, true)
      client.onDiscovery().then(->
        promise = client.resource.get()
        expect(promise).to.eventually.be.equal(resource: true).notify(actuallyDone)
      )
    , done)


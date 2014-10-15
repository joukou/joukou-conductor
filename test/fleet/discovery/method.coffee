proxyquire        = require("proxyquire")

DiscoveryMethod   = require( '../../../dist/fleet/discovery/method')
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect
assert            = chai.assert
Q                 = require("q")

describe "method", ->
  specify "path is required", ->
    expect(->
      new DiscoveryMethod("a", "test", "GET")
    ).to.Throw(Error, "Path not provided for a")

  specify "http method is required", ->
    expect(->
      new DiscoveryMethod("a", "test")
    ).to.Throw(Error, "Http method not provided for a")

  specify "check required doesn't throw error", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    expect(->
      method._checkRequired({
        key1: {
          required: true,
          value: "test"
        },
        key2: {
          required: false,
          value: null
        }
      })
    ).to.not.Throw()

  specify "check required throws error", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    expect(->
      method._checkRequired({
        key1: {
          required: true,
          value: null
        }
      })
    ).to.Throw(Error, "the parameter key1 is required")

  specify "groups values with type and required", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {
      key1: {
        required: true,
        type: "string"
      },
      key2: {
        required: false,
        type: "number"
      }
    })
    params = method._groupValue({
      key1: "test",
      key2: 1
    })
    expect(params.key1.required).to.be.ok
    expect(params.key1.value).to.equal("test")
    expect(params.key2.required).to.be.not.ok
    expect(params.key2.value).to.equal(1)

  specify "doesn't group null value", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {
      key1: {
        required: true,
        type: "string"
      }
    })
    params = method._groupValue({
      key1: null
    })
    expect(params.key1.value).to.not.exist
    expect(params.key1.value).to.not.equal(null)

  specify "group value fixes type", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {
      key1: {
        required: true,
        type: "string"
      }
    })
    params = method._groupValue({
      key1: 1
    })
    expect(params.key1.value).to.equal("1")

  specify "group value fails on wrong type", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {
      key1: {
        required: true,
        type: "number"
      }
    })
    expect(->
      method._groupValue({
        key1: "1"
      })
    ).to.Throw(Error, "'1' is not typeof number" )

  specify "on response throws error on 404",(done)  ->
    localDiscoveryMethod = proxyquire( '../../../dist/fleet/discovery/method', {
      request: (options, callback) ->
          callback(null, { statusCode: 404 })
    })
    method = new localDiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/"
    }
    deferred = Q.defer()
    expect(deferred.promise).to.eventually.be.rejectedWith(Error, "Status code returned 404").notify(done)
    method._doRequest({}, {}, deferred)

  specify "on response throws error on 404 (no proxy)", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    deferred = Q.defer()
    expect(deferred.promise).to.eventually.be.rejectedWith(Error, "Status code returned 404").notify(done)
    method._onResponse(null, {statusCode:404}, null, deferred)

  specify "on response throws no body", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    deferred = Q.defer()
    expect(deferred.promise).to.eventually.be.rejectedWith(Error, "No body").notify(done)
    method._onResponse(null, {statusCode:200}, null, deferred)

  specify "on response with no body PUT", (done)  ->
    method = new DiscoveryMethod("a", "test", "PUT", "path", {})
    deferred = Q.defer()
    expect(deferred.promise).to.eventually.equal(undefined).notify(done)
    method._onResponse(null, {statusCode:202}, null, deferred)

  specify "call method resolves", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method._doRequest = (a, b, deferred) ->
      deferred.resolve()
    expect(method.callMethod({})).to.eventually.equal(undefined).notify(done)

  specify "call method rejects", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method._doRequest = (a, b, deferred) ->
      deferred.reject()
    expect(method.callMethod({})).to.eventually.be.rejected.notify(done)

  specify "call method rejects when bad parameters", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    expect(method.callMethod(1)).to.eventually.rejectedWith(Error, "Params is expected to be an Object").notify(done)

  specify "call method resolves with correct parameters", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {key1:{type:"string"}})
    method._doRequest = (params, b, deferred) ->
      expect(params).to.include.key("key1")
      expect(params.key1).to.equal("test")
      deferred.resolve("Test")
    expect(method.callMethod({key1:"test"})).to.eventually.equal("Test").notify(done)

  specify "call method resolves with no params", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method._doRequest = (a, b, deferred) ->
      deferred.resolve("Test")
    expect(method.callMethod(null)).to.eventually.equal("Test").notify(done)

  specify "call method rejects with no params", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method._doRequest = (a, b, deferred) ->
      deferred.resolve("Test")
    expect(method.callMethod(null)).to.eventually.equal("Test").notify(done)

  specify "on response with no body PUT", (done)  ->
    method = new DiscoveryMethod("a", "test", "PUT", "path", {})
    deferred = Q.defer()
    expect(deferred.promise).to.eventually.be.rejected.notify(done)
    method._onResponse(null, {statusCode:202}, [], deferred)

  specify "group value doesn't add quotes to number on error", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {
      key1: {
        required: true,
        type: "array"
      }
    })
    expect(->
      method._groupValue({
        key1: 1
      })
    ).to.Throw(Error, "1 is not typeof array" )






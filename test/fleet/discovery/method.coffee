proxyquire        = require("proxyquire")

DiscoveryMethod   = require( '../../../dist/fleet/discovery/method')
DiscoverySchema   = require( '../../../dist/fleet/discovery/schema')
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

  specify "do request uses previous request if provided", (done)  ->
    localDiscoveryMethod = proxyquire( '../../../dist/fleet/discovery/method', {
      request: (options, callback) ->
        callback(null, { statusCode: 404 })
    })
    method = new localDiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/"
    }
    params = {
      value: "value"
    }
    req = {
      test: true
    }
    deferred = Q.defer()
    method._onResponse = (err, response, body, deferred, currentRequest) ->
      expect(currentRequest.qs).to.not.exist
      expect(currentRequest.test).to.equal(true)
      deferred.resolve()
    method._doRequest(params, {}, deferred, req)
    expect(deferred.promise).to.eventually.be.fulfilled.notify(done)

  specify "do request checks for response $ref", (done)  ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/"
    }
    method.response = {
      $ref: "UnitPage"
    }
    deferred = Q.defer()
    method._resolveWithSchemaResponse = (jsonBody, deferred, currentRequest) ->
      deferred.resolve(true)
    method._onResponse(null, statusCode: 200, '{"values":[]}', deferred)
    expect(deferred.promise).to.eventually.equal(true).notify(done)

  specify "resolve with schema resolves when schema not found", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return null
    }
    method.response = {
      $ref: "UnitPage"
    }
    deferred = Q.defer()
    value = {units:[{name:"test"}]}
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.equal(value).notify(done)

  specify "resolve with schema resolves when schema found, but no next token", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return properties:
          units:
            type: "array"
    }
    method.response = {
      $ref: "UnitPage"
    }
    deferred = Q.defer()
    value = {units:[{name:"test"}]}
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.equal(value).notify(done)

  specify "resolve with schema resolves when next page token exists, but not in response", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return properties:
          units:
            type: "array"
          nextPageToken:
            type: "string"
    }
    method.response = {
      $ref: "UnitPage"
    }
    deferred = Q.defer()
    value = {units:[{name:"test"}]}
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.equal(value.units).notify(done)

  specify "resolve with schema resolves when next page token exists, but no other key", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return {
        properties:
          nextPageToken:
            type: "string"
        }
    }
    method.response = {
      $ref: "UnitPage"
    }
    deferred = Q.defer()
    value = {units:[{name:"test"}]}
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.equal(value).notify(done)

  specify "resolve with schema resolves when next page token exists, but property isn't an array", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return {
        properties:
          units:
            type: "object"
          nextPageToken:
            type: "string"
        }
    }
    method.response = {
      $ref: "UnitPage"
    }
    deferred = Q.defer()
    value = {units:[{name:"test"}]}
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.equal(value).notify(done)

  specify "resolve with schema resolves when value isn't the expected", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return {
        properties:
          units:
            type: "array"
          nextPageToken:
            type: "string"
        }
    }
    method.response = {
      $ref: "UnitPage"
    }
    deferred = Q.defer()
    value = {units:{name:"test"}}
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.equal(value).notify(done)

  specify "gets next page", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return {
        properties:
          units:
            type: "array"
          nextPageToken:
            type: "string"
        }
    }
    method.response = {
      $ref: "UnitPage"
    }
    value = {units:[{name:"test"}], nextPageToken: "next"}
    method._doRequest = (a, b, lastDeferred, previousRequest) ->
      expect(previousRequest.qs.nextPageToken).to.equal(value.nextPageToken)
      lastDeferred.resolve(value.units)
    deferred = Q.defer()
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.have.lengthOf(2).notify(done)

  specify "returns first page if next page fails", (done) ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.client = {
      endpoint: "localhost:4000",
      basePath: "/",
      getSchema: ->
        return {
        properties:
          units:
            type: "array"
          nextPageToken:
            type: "string"
        }
    }
    method.response = {
      $ref: "UnitPage"
    }
    value = {units:[{name:"test"}], nextPageToken: "next"}
    method._doRequest = (a, b, lastDeferred, previousRequest) ->
      expect(previousRequest.qs.nextPageToken).to.equal(value.nextPageToken)
      lastDeferred.reject()
    deferred = Q.defer()
    method._resolveWithSchemaResponse(value, deferred, {})
    expect(deferred.promise).to.eventually.have.lengthOf(1).notify(done)

  specify "groups values with enum works", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {
      key1: {
        type: "string"
        enum: [
          "test",
          "test2"
        ]
      }
    })
    expect( ->
      method._groupValue({
        key1: "test"
      })
    ).to.not.Throw()

  specify "groups values with enum fails", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {
      key1: {
        type: "string"
        enum: [
          "test",
          "test2"
        ]
      }
    })
    expect( ->
      method._groupValue({
        key1: "test3"
      })
    ).to.Throw(Error, "'test3' is not one of 'test', 'test2'")

  specify "method resolves no body if no request required", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    expect(method._getRequestBody({})).to.equal(null)

  specify "method resolves no body if no request required (no $ref)", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.request = {}
    expect(method._getRequestBody({})).to.equal(null)

  specify "method throws error if request required but no body", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.request = {
      $ref: "Unit"
    }
    expect(->
      method._getRequestBody()
    ).to.Throw("Request body is required")

  specify "method uses body if can't find schema, but request required", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.request = {
      $ref: "Unit"
    }
    method.client = {
      getSchema: ->
        return null
    }
    value = {val:1}
    expect(method._getRequestBody(value)).to.equal(value)

  specify "method uses body if valid", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.request = {
      $ref: "Unit"
    }
    simpleSchema = new DiscoverySchema("simple", "object", {
      key:
        type: "string"
        required: true
    }, {})
    method.client = {
      getSchema: ->
        return simpleSchema
    }
    value = {key:"value"}
    body = method._getRequestBody(value)
    expect(body).to.exist
    expect(body).to.include.key("key")
    expect(body.key).to.equal(value.key)

  specify "method throws error if value has error", ->
    method = new DiscoveryMethod("a", "test", "GET", "path", {})
    method.request = {
      $ref: "Unit"
    }
    simpleSchema = new DiscoverySchema("simple", "object", {
      key:
        type: "string"
        required: true
    }, {})
    method.client = {
      getSchema: ->
        return simpleSchema
    }
    value = {key:null}
    expect(->
      method._getRequestBody(value)
    ).to.Throw(Error)






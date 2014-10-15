proxyquire        = require("proxyquire")

DiscoveryMethod   = require( '../../../dist/fleet/discovery/method')
assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect

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


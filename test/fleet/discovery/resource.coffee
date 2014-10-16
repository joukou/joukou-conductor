proxyquire        = require("proxyquire")

DiscoveryResource = require( '../../../dist/fleet/discovery/resource')
assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect

describe "resource", ->
  specify "methods attach", ->
    resource = new DiscoveryResource("name", {
      methodName: {
        callMethod: ->

      }
    }, {})
    expect(resource).to.include.key("methodName")

  specify "methods are called", ->
    methodCalled = false
    resource = new DiscoveryResource("name", {
      methodName: {
        callMethod: ->
          methodCalled = true
      }
    }, {})
    resource.methodName()
    expect(methodCalled).to.be.ok

  specify "methods are called with parameters", ->
    methodCalled = false
    resource = new DiscoveryResource("name", {
      methodName: {
        callMethod: (a, b, c) ->
          methodCalled = a and b and c
      }
    }, {})
    resource.methodName(true, true, true)
    expect(methodCalled).to.be.ok

  specify "has method returns true", ->
    resource = new DiscoveryResource("name", {
      methodName: {
        callMethod: ->

      }
    }, {})
    expect(resource.hasMethod("methodName")).to.be.ok

  specify "has method returns true", ->
    resource = new DiscoveryResource("name", {
      methodName: {
        callMethod: ->

      }
    }, {})
    expect(resource.getMethod("methodName")).to.exist
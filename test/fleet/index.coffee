proxyquire        = require("proxyquire")

clientModule      = require( '../../dist/fleet/index')
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect
assert            = chai.assert

describe "fleet", ->
  specify "calls do discovery", ->
    localClientModule = proxyquire( '../../dist/fleet/index', {
      './discovery/client':
        getClient: ->
          return {
            discovered: false
            doDiscovery: ->
              this.discovered = true
              return true
          }
    })
    client = localClientModule.getClient("endpoint", null, true)
    expect(client.discoveryClient).to.exist
    expect(client.discoveryClient.discovered).to.be.ok
  specify "create unit returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.createUnit()).to.equal(true)
  specify "delete unit returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.destroyUnit()).to.equal(true)
  specify "set state returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.setUnitDesiredState()).to.equal(true)
  specify "get state returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.getUnitDesiredState()).to.equal(true)
  specify "get states returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.getUnitDesiredStates()).to.equal(true)
  specify "get states returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.createUnit()).to.equal(true)
  specify "get machine states returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.getMachineStates()).to.equal(true)
  specify "get unit states returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.getUnitStates()).to.equal(true)
  specify "get states returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.getStates()).to.equal(true)
  specify "get machines returns correct value", ->
    client = clientModule.getClient("localhost:4000")
    client.discoveryClient = {
      on:
        method: ->
          return true
    }
    expect(client.getMachines()).to.equal(true)



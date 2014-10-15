proxyquire        = require("proxyquire")

DiscoveryResource = require( '../../../dist/fleet/discovery/resource')
assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect

describe "resource", ->

proxyquire        = require("proxyquire")

DiscoverySchema   = require( '../../../dist/fleet/discovery/schema')
assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect

describe "schema", ->
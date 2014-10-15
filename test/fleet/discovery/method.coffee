proxyquire        = require("proxyquire")

DiscoveryMethod   = require( '../../../dist/fleet/discovery/method')
assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect

describe "method", ->
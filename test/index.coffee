assert            = require( 'assert' )
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use( chaiAsPromised )
should            = chai.should()

index             = require( '..' )

describe 'index', ->

  specify 'is eventually resolved with 42', ->
    index().should.eventually.equal( 42 )
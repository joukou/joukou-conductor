Unit              = require( '../../dist/systemd/unit')
chai              = require( 'chai' )
expect            = chai.expect

describe "unit", ->
  specify "takes section name", ->
    unit = new Unit()
    expect(unit.section).to.equal("Unit")
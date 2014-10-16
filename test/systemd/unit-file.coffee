UnitFile          = require( '../../dist/systemd/unit-file')
chai              = require( 'chai' )
expect            = chai.expect

describe "unit file", ->
  specify "defines options", ->
    file = new UnitFile()
    expect(file.options).to.be.instanceof(Array)
  specify "adds values", ->
    file = new UnitFile()
    name = "name"
    value = "value"
    file.service.addPair(name, value)
    expect(file.options[0].name).to.equal(name)
    expect(file.options[0].value).to.equal(value)
    expect(file.options[0].section).to.equal("Service")

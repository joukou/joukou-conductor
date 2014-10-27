systemd      = require( '../../dist/noflo/systemd' )
chai         = require( 'chai' )
expect       = chai.expect
assert       = chai.assert
fs           = require( 'fs' )

file = fs.readFileSync('./test/noflo/photobooth.json', 'utf8')
json = JSON.parse(file)
machineID = "MACHINE_ID"
AMQA = "AMQA"
API = "API"
EXCHANGE = "EXCHANGE"

describe 'noflo systemd', ->
  specify "works", ->
    systemdFile = systemd.createFromSchema(json, machineID, AMQA, API, EXCHANGE)
    expect(systemdFile).to.exist
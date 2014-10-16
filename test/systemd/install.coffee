Install           = require( '../../dist/systemd/install')
chai              = require( 'chai' )
expect            = chai.expect

testAddKey = (Section, functionName, key, value) ->
  section = new Section()
  expect(Section.prototype).to.include.key(functionName)
  optionsLength = section.options.length
  section[functionName](value)
  expect(section.options.length).to.equal(optionsLength + 1)
  option = section.options[optionsLength]
  expect(option.section).to.equal(section.section)
  expect(option.name).to.equal(key)
  expect(option.value).to.equal(value)

describe "install", ->
  specify "takes section name", ->
    install = new Install()
    expect(install.section).to.equal("Install")
  specify "add pair", ->
    install = new Install()
    install.addPair("key", "value")
    expect(install.options.length).to.equal(1)
  specify "add alias", ->
    testAddKey(Install, "addAlias", "Alias", "value")
  specify "add wanted", ->
    testAddKey(Install, "addWantedBy", "WantedBy", "value")
  specify "add wanted", ->
    testAddKey(Install, "addRequiredBy", "RequiredBy", "value")
  specify "add also", ->
    testAddKey(Install, "addAlso", "Also", "value")
  specify "add default instance", ->
    testAddKey(Install, "addDefaultInstance", "DefaultInstance", "value")

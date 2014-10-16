UnitCommon        = require( '../../dist/systemd/unit-common')
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

describe "unit-common", ->
  specify "takes section name", ->
    name = "sectionName"
    common = new UnitCommon(name)
    expect(common.section).to.equal(name)
  specify "add Description", ->
    testAddKey(UnitCommon, "addDescription", "Description", "value")
  specify "add Documentation", ->
    testAddKey(UnitCommon, "addDocumentation", "Documentation", "value")
  specify "add Requires", ->
    testAddKey(UnitCommon, "addRequires", "Requires", "value")
  specify "add Wants", ->
    testAddKey(UnitCommon, "addWants", "Wants", "value")
  specify "add BindsTo", ->
    testAddKey(UnitCommon, "addBindsTo", "BindsTo", "value")
  specify "add PartOf", ->
    testAddKey(UnitCommon, "addPartOf", "PartOf", "value")
  specify "add Before", ->
    testAddKey(UnitCommon, "addBefore", "Before", "value")
  specify "add After", ->
    testAddKey(UnitCommon, "addAfter", "After", "value")
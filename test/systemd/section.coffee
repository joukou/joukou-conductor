Section           = require( '../../dist/systemd/section')
chai              = require( 'chai' )
expect            = chai.expect

describe "section", ->
  specify "takes section name", ->
    name = "sectionName"
    section = new Section(name)
    expect(section.section).to.equal(name)
  specify "adds pair", ->
    section = new Section("name")
    name = "key"
    value = "value"
    section.addPair(name, value)
    expect(section.options.length).to.equal(1)
    expect(section.options[0].name).to.equal(name)
    expect(section.options[0].value).to.equal(value)
    expect(section.options[0].section).to.equal(section.section)
  specify "fails when name not string", ->
    section = new Section("name")
    name = 1
    value = "value"
    expect(->
      section.addPair(name, value)
    ).to.Throw("name is required to be a string")
  specify "fails when value not string", ->
    section = new Section("name")
    name = "key"
    value = 1
    expect(->
      section.addPair(name, value)
    ).to.Throw("value is required to be a string")
  specify "error is thrown if parameter name not given", ->
    expect(Section.assertString).to.Throw("parameter is required to be a string")
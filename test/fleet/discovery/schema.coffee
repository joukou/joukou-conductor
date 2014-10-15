proxyquire        = require("proxyquire")

DiscoverySchema   = require( '../../../dist/fleet/discovery/schema')
chai              = require( 'chai' )
chaiAsPromised    = require( 'chai-as-promised' )
chai.use(chaiAsPromised)
expect            = chai.expect
asset             = chai.assert
schemajs          = require( 'schemajs' )

describe "schema", ->
  specify "check type array true", ->
    expect(DiscoverySchema.checkType([], "array")).to.be.ok
  specify "check type array false", ->
    expect(DiscoverySchema.checkType({}, "array")).to.be.no
  specify "check type object true", ->
    expect(DiscoverySchema.checkType({}, "object")).to.be.ok
  specify "check type object false (Array)", ->
    expect(DiscoverySchema.checkType([], "object")).to.be.no
  specify "check type object false (Date)", ->
    expect(DiscoverySchema.checkType(new Date(), "object")).to.be.no
  specify "check type string true", ->
    expect(DiscoverySchema.checkType("", "string")).to.be.ok
  specify "check type string false", ->
    expect(DiscoverySchema.checkType(1, "string")).to.be.no
  specify "check type integer true", ->
    expect(DiscoverySchema.checkType(1, "integer")).to.be.ok
  specify "check type integer false (string)", ->
    expect(DiscoverySchema.checkType("", "integer")).to.be.no
  specify "check type integer false (float)", ->
    expect(DiscoverySchema.checkType(1.1, "integer")).to.be.no
  specify "check type number true (int)", ->
    expect(DiscoverySchema.checkType(1, "number")).to.be.ok
  specify "check type number true (float)", ->
    expect(DiscoverySchema.checkType(1.1, "number")).to.be.ok
  specify "check type number false", ->
    expect(DiscoverySchema.checkType("", "number")).to.be.no
  specify "check type boolean true (boolean true)", ->
    expect(DiscoverySchema.checkType(true, "boolean")).to.be.ok
  specify "check type boolean true (boolean false)", ->
    expect(DiscoverySchema.checkType(false, "boolean")).to.be.ok
  specify "check type boolean false", ->
    expect(DiscoverySchema.checkType({}, "boolean")).to.be.no
  specify "check type any true (array)", ->
    expect(DiscoverySchema.checkType([], "any")).to.be.ok
  specify "check type any true (object)", ->
    expect(DiscoverySchema.checkType({}, "any")).to.be.ok
  specify "check type any true (string)", ->
    expect(DiscoverySchema.checkType("", "any")).to.be.ok
  specify "check type any true (integer)", ->
    expect(DiscoverySchema.checkType(1, "any")).to.be.ok
  specify "check type any true (float)", ->
    expect(DiscoverySchema.checkType(1.1, "any")).to.be.ok
  specify "check type any true (boolean)", ->
    expect(DiscoverySchema.checkType(false, "any")).to.be.ok
  specify "check type unknown false", ->
    expect(DiscoverySchema.checkType(undefined, "unknown")).to.be.no
  specify "'any' schema type is added type schema.types", ->
    schema = new DiscoverySchema("id", "object", {}, {})
    schema.schemaOptions = {
      key: {
        type: "any"
      }
    }
    expect(schema._validateSchema({
      key: 1
    }).valid).to.be.ok
  specify "schema generates for simple properties", ->
    schema = new DiscoverySchema("id", "object", {
      key1:
        type: "any"
        required: true
      key2:
        type: "string"
      key3:
        type: "number"
    }, {})
    options = schema._generateSchemaOptions()
    expect(options).to.include.key("key1")
    expect(options).to.include.key("key2")
    expect(options).to.include.key("key3")
  specify "schema validates for simple properties", ->
    schema = new DiscoverySchema("id", "object", {
      key1:
        type: "any"
        required: true
      key2:
        type: "string"
      key3:
        type: "number"
    }, {})
    expect(schema._validateSchema({
      key1: 1,
      key2: "value",
      key3: 1
    }).valid).to.be.ok
    expect(schema._validateSchema({
      key2: "value",
      key3: 1
    }).valid).to.be.not.ok

  specify "schema validates for integer", ->
    schema = new DiscoverySchema("id", "object", {
      key:
        type: "integer"
    }, {})
    expect(schema._validateSchema({
      key: 1,
    }).valid).to.be.ok
    expect(schema._validateSchema({
      key: 1.1
    }).valid).to.be.not.ok

  specify "schema validates for simple object", ->
    schema = new DiscoverySchema("id", "object", {
      key:
        type: "object"
    }, {})
    expect(schema._validateSchema({
      key: {},
    }).valid).to.be.ok
    expect(schema._validateSchema({
      key: []
    }).valid).to.be.not.ok

  specify "schema validates for simple array", ->
    schema = new DiscoverySchema("id", "object", {
      key:
        type: "array"
    }, {})
    expect(schema._validateSchema({
      key: [],
    }).valid).to.be.ok
    expect(schema._validateSchema({
      key: {}
    }).valid).to.be.not.ok

  specify "schema validates for items array (no $ref)", ->
    schema = new DiscoverySchema("id", "object", {
      key:
        type: "array"
        items:
          type: "string"
    }, {})
    expect(schema._validateSchema({
      key: [""],
    }).valid).to.be.ok
    ###
    # TODO add type checking for no $ref
    expect(schema._validateSchema({
      key: [1]
    }).valid).to.be.not.ok
    ###
    expect(schema._validateSchema({
      key: {},
    }).valid).to.be.not.ok





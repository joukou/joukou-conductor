schemajs  = require("schemajs")
_         = require("lodash")

class DiscoverySchema
  id: ""
  type: ""
  properties: {}
  schema: null
  schemaOptions: null
  client: null
  ###*
  * @param {string} id
  * @param {string} type
  * @param {Object} properties
  ###
  constructor: (id, type, properties, client) ->
    this.id = id
    this.type = type
    this.properties = properties
    this.client = client
    if not type
      # We use type for validation
      throw new Error("Type is required")
  validate: (value) ->
    if value is null or value is undefined
      return {
        valid: false
        value: value
        reason: "Value is null or undefined"
        noValue: true
      }
    if this.type is "string" and typeof value isnt "string"
      value = JSON.stringify(value)
    if not DiscoverySchema.checkType(value, this.type)
      return {
        valid: false
        value: value
        reason: "Type of value isn't #{this.type}"
      }
    if this.type is "object"
      validation = this._validateSchema(value)
      if validation.valid
        return {
          valid: true
          value: validation.data
        }
      else
        values = _.values(validation.errors)
        return {
          valid: false
          value: value
          reason: values[0]
        }
    else
      return {
        valid: true
        value: value
      }
  @checkType: (value, type) ->
    # Valid types
    # http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.1
    switch type
      when "array"
        _.isArray( value )
      when "object"
        _.isPlainObject( value )
      when "string"
        _.isString( value )
      when "integer"
        return false if not _.isNumber( value )
        value is parseInt( value )
      when "number"
        _.isNumber(value)
      when "boolean"
        _.isBoolean(value)
      when "any"
        true
      else
        false
  _validateSchema: (value) ->
    this._generateSchema()
    return this.schema.validate(value)
  _generateSchema: ->
    if not schemajs.types.any
      schemajs.types.any = ->
        true
    this.schema = this.schema or schemajs.create(this._generateSchemaOptions())
  _generateSchemaOptions: ->
    if this.schemaOptions
      return this.schemaOptions
    options = {}
    for key of this.properties
      if not this.properties.hasOwnProperty(key)
        continue
      property = this.properties[key]
      if property.type is "array" or property.type is "object"
        this._attachChildSchema(options, property, key)
      else
        options[key] = {
          type: this._correctType(property.type),
          required: !!property.required
        }
    this.schemaOptions = options
  _correctType: (type) ->
    # "integer" is the only type that is different
    # https://github.com/eleith/schemajs#schematypes
    # I have extended schema to accept type "any"
    if type is "integer"
      return "int"
    return type
  _attachChildSchema: (options, property, key) ->
    if property.type isnt "object" and property.type isnt "array"
      return
    options[key] = {
      type: property.type,
      required: !!property.required
    }
    ref = null
    if property.type is "array" and property.items instanceof Object
      ref = property.items.$ref
    else if property.type is "object"
      ref = property.$ref
    if not ref
      return
    childSchema = this.client.getSchema(ref)
    # We don't want circular references
    if not childSchema or childSchema is this
      return
    if property.type is "object" and childSchema.type isnt "object"
      throw new Error("Child schema must be an object is property is an object")
    if childSchema.type is "object"
      if property.type is "object"
        options[key].schema = childSchema._generateSchemaOptions()
      else # if property.type is "array"
        options[key].schema =
          schema: childSchema._generateSchemaOptions()
          type: childSchema.type
    else
      options[key].schema = type: this._correctType(childSchema.type)
module.exports = DiscoverySchema
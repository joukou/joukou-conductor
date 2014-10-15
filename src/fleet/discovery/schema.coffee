schema  = require("schemajs")
_       = require("lodash")
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
      }
    if this.type is "string" and typeof value isnt string
      value = JSON.parse(value)
    if DiscoverySchema.checkType(value, this.type)
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
        reason = "request is not valid"
        if values.length
          reason = values[0]
        return {
          valid: false
          value: value
          reason: reason
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
    if not schema.types.any
      schema.types.any = ->
        true
    this.schema = this.schema or schema.create(this._generateSchemaOptions())
  _generateSchemaOptions: ->
    if this.schemaOptions
      return this.schemaOptions
    options = {}
    for key of this.properties
      if not this.properties.hasOwnProperty(key)
        continue
      property = this.properties[key]
      if property.type is "array"
        options[key] = {
          type: "array",
          required: !!property.required
        }
        if property.items not instanceof Object
          continue
        if not property.items.$ref
          # TODO implement other than $ref
          # Fleet API only uses $ref currently
          continue
        ref = property.items.$ref
        schema = this.client.getSchema(ref)
        # We don't want circular references
        if not schema or schema is this
          continue
        options[key].schema = this
          .client
          .getSchema(ref)
          ._generateSchemaOptions()
      else if property.type is "object"
        options[key] = {
          type: "object",
          required: !!property.required
        }
        if not property.$ref
          # TODO implement other than $ref
          continue
        ref = property.$ref
        schema = this.client.getSchema(ref)
        # We don't want circular references
        if not schema or schema is this
          continue
        options[key].schema = this
          .client
          .getSchema(ref)
          ._generateSchemaOptions()
      else
        type = null
        # "integer" is the only type that is different
        # https://github.com/eleith/schemajs#schematypes
        # I have extended schema to accept type "any"
        if property.type is "integer"
          type = "int"
        else
          type = property.type
        options[key] = {
          type: type,
          required: !!property.required
        }
    this.schemaOptions = options

module.exports = DiscoverySchema
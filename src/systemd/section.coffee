class SystemDSection
  section: "unknown"
  options: []
  constructor: (@section) ->
    this.options = []
  addPair: (name, value) ->
    @assertString(name, "name")
    @assertString(value, "value")
    this.options.push(
      section: this.section
      name: name
      value: value
    )
  assertString: (value, name) ->
    if typeof value isnt "string"
      throw new TypeError("#{name or "parameter"} is required to be a string")



module.exports = SystemDSection
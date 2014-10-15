
class DiscoveryResource
  name: ""
  methods: []
  client: null
  ###*
  * @param {string} name
  * @param {Array.<DiscoveryMethod>} methods
  ###
  constructor: (name, methods, client) ->
    this.name = name
    this.methods = methods
    this.client = client
    this._attachMethods()
  _attachMethods: ->
    for key of this.methods
      if not this.methods.hasOwnProperty(key)
        continue
      this._attachMethod(key)
  _attachMethod: (key) ->
    resource = this
    this[key] = ->
      method = resource.methods[key]
      return method.callMethod.apply(method, arguments)
  getMethod: (name) ->
    return this.methods[name]
  hasMethod: (name) ->
    return !!this.methods[name]

module.exports = DiscoveryResource
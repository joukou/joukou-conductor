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
    for methodName of this.methods
      if not this.methods.hasOwnProperty(methodName)
        continue
      this._attachMethod(methodName)
  _attachMethod: (methodName) ->
    this[methodName] = this.wrapCallMethod(methodName)
  wrapCallMethod: (methodName) ->
    resource = this
    return ->
      method = resource.methods[methodName]
      method.callMethod.apply(method, arguments)
  getMethod: (name) ->
    return this.methods[name]
  hasMethod: (name) ->
    return !!this.methods[name]

module.exports = DiscoveryResource
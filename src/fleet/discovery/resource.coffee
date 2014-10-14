
class DiscoveryResource
  name: ""
  methods: []
  ###*
  * @param {string} name
  * @param {Array.<DiscoveryMethod>} methods
  ###
  constructor: (name, methods) ->
    this.name = name
    this.methods = methods

module.exports = DiscoveryResource
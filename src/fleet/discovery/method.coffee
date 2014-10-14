class DiscoveryMethod
  id: ""
  description: ""
  httpMethod: ""
  path: ""
  parameters: {}
  parameterOrder: []
  request: {}
  response: {}
  constructor: (id,
                description,
                httpMethod,
                path,
                parameters,
                parameterOrder,
                request,
                response) ->
    this.id = id
    this.description = description
    this.httpMethod = httpMethod
    this.path = path
    this.parameters = parameters
    this.parameterOrder = parameterOrder
    this.request = request
    this.response = response

module.exports = DiscoveryMethod
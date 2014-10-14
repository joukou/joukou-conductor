client            = require( '../../../src/fleet/discovery/client')

chai              = require( 'chai' )
expect            = chai.expect

describe "client", ->
  specify "client discovery resource evaluate", ->
    client = client.getClient("localhost:4002", "/v1-alpha/")
    expect(client).to.exist
    resources = client.resolveDiscovery(
      resources:
        resource:
          methods:
            get:
              id: "get"
              description: "get"
              httpMethod: "GET"
              path: "resource"
              parameters:
                name:
                  type: "string"
                  location: "query"
    )
    expect(resources, "resources").to.exist
    expect(resources).to.be.instanceof(Object)

    expect(resources.resource).to.exist
    expect(resources.resource).to.be.instanceof(Object)

    expect(resources.resource.methods).to.exist
    expect(resources.resource.methods).to.be.instanceof(Object)

    expect(resources.resource.methods.get).to.exist
    expect(resources.resource.methods.get).to.be.instanceof(Object)
    expect(resources.resource.methods.get.id).to.equal("get")

SystemDUnitFile = require("../systemd/unit-file")
_               = require("lodash")

createFromSchema: (input,
                   machineID,
                   joukouMessageQueAddress,
                   joukouApiAddress) ->
  if not _.isPlainObject(input)
    throw new TypeError("input is not an object")
  if not machineID
    throw new Error("machineID is required")
  if typeof machineID isnt "string"
    throw new TypeError("machineID is not a string")
  if not _.isPlainObject(input.properties)
    throw new TypeError("input.properties is not an object")
  if not _.isPlainObject(input.processes)
    throw new TypeError("input.processes is not an object")
  if not _.isArray(input.connections)
    throw new TypeError("input.connections is not an array")
  name = input.properties.name
  if not name
    throw new Error("input.properties.name is required")
  connections = _.cloneDeep(input.connections)
  processes = _.cloneDeep(input.processes)
  return createOptions(name, processes, connections)

createOptions = (name,
                 processes,
                 connections,
                 machineID,
                 joukouMessageQueAddress,
                 joukouApiAddress) ->
  options = []
  ###
  use format
  [
    {
      unitName: "name"
      options: [SystemDUnitFile].options
      machineID: machineID
    }
  ]
  ###
  for processKey in input.processes
    if not input.hasOwnProperty(processKey)
      continue
    process = input.processes[processKey]
    unit = {
      process: process
      processKey: processKey
      machineID: machineID
      dockerContainer: process.component
      ports: this.findPorts(connections, processKey)
    }
    file = createFile(
      unit,
      joukouMessageQueAddress,
      joukouApiAddress
    )
    options.push({
      unitName: processKey
      options: file.options
      machineID: machineID
    })

  return options

createFile = (unit,
              joukouMessageQueAddress,
              joukouApiAddress) ->

  file = new SystemDUnitFile()
  file.service.addEnvironment("JOUKOU_AMQP_ADDR", joukouMessageQueAddress)
  file.service.addEnvironment("JOUKOU_API_ADDR", joukouApiAddress)


  return file



generateConnectionKeys: (ports) ->
  # Not to sure what Isaac wants to be
  # done here, add fakes for now
  for port in connections
    if not port.exchangeKey
      port.exchangeKey = "FAKE_SOURCE"
      port.routingKey = "FAKE_SOURCE"

checkForBrokenConnections: (connections) ->
  i = 0
  while i < connections.length
    i++
    connection = connections[i]
    if not _.isPlainObject(connection)
      continue
    target = connection["tgt"]
    source = connection["src"]
    if not target and not source
      continue
    if not _.isPlainObject(target)
      throw new Error("No target for connection #{i}")
    if not _.isPlainObject(source)
      throw new Error("No source for connection #{i}")

findPorts = (connections, processKey) ->
  result = []
  for connection in connections
    if connection.tgt.process is processKey
      result.push({
        port: connection.tgt
        connection: connection
      })
    if connection.src.process is processKey
      result.push({
        port: connection.src
        connection: connection
      })
  result

module.exports =
  createFromSchema: createFromSchema
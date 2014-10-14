###*
@module joukou-conductor/fleet/index
@author Fabian Cook <fabian.cook@joukou.com>
@copyright (c) 2009-2014 Joukou Ltd. All rights reserved.
###

Q         = require("Q")
discovery = require("./discovery/client")

class FleetClient
  ###*
  @type {DiscoveryClient}
  ###
  discoveryClient: null
  constructor: (endpoint) ->
    discoveryClient = client.getClient(endpoint)
    discoveryClient.doDiscovery()
  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#create-a-unit
  createUnit: (name, options, desiredState, currentState, machineId) ->
    deferred = Q.defer()
    self.discoveryClient
      .onDiscovery()
      .then((client) ->

    )
    deferred.promise

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#modify-desired-state-of-a-unit
  setUnitDesiredState: (name, desiredState) ->
    deferred = Q.defer()

    deferred.promise

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#retrieve-desired-state-of-a-specific-unit
  getUnitDesiredState: (name) ->
    deferred = Q.defer()

    deferred.promise

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#retrieve-desired-state-of-all-units
  getUnitDesiredStates: ->
    deferred = Q.defer()

    deferred.promise

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#destroy-a-unit
  destroyUnit: (unitName) ->
    deferred = Q.defer()

    deferred.promise

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#retrieve-current-state-of-all-units
  getMachineStates: (machineId) ->
    return self.getState(
      machineId: machineId
    )

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#retrieve-current-state-of-all-units
  getUnitStates: (unitName) ->
    return self.getState(
      unitName: unitName
    )

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#retrieve-current-state-of-all-units
  getStates: (opts) ->
    deferred = Q.defer()

    deferred.promise

  # https://github.com/coreos/fleet/blob/master/Documentation/api-v1-alpha.md#list-machines
  getMachines: ->
    deferred = Q.defer()

    deferred.promise

module.exports =
  getClient: (endpoint) ->
    new FleetClient(endpoint)
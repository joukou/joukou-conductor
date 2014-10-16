Section = require("./section")

class SystemDInstall extends Section
  constructor: ->
    super("Install")

  # http://0pointer.de/public/systemd-man/systemd.unit.html#Alias=
  addAlias: (value) ->
    @addPair("Alias", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#WantedBy=
  addWantedBy: (value) ->
    @addPair("WantedBy", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#WantedBy=
  addRequiredBy: (value) ->
    @addPair("RequiredBy", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#Also=
  addAlso: (value) ->
    @addPair("Also", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#DefaultInstance=
  addDefaultInstance: (value) ->
    @addPair("DefaultInstance", value)

module.exports = SystemDInstall
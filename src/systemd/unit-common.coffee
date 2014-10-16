Section = require("./section")

# For all other options see
# http://0pointer.de/public/systemd-man/systemd.unit.html
class SystemDUnitCommon extends Section
  constructor: (section) ->
    super(section)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#Description=
  addDescription: (value) ->
    @addPair("Description", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#Documentation=
  addDocumentation: (value) ->
    @addPair("Documentation", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#Requires=
  addRequires: (value) ->
    @addPair("Requires", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#Wants=
  addWants: (value) ->
    @addPair("Wants", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#BindsTo=
  addBindsTo: (value) ->
    @addPair("BindsTo", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#PartOf=
  addPartOf: (value) ->
    @addPair("PartOf", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#Before=
  addBefore: (value) ->
    @addPair("Before", value)

  # http://0pointer.de/public/systemd-man/systemd.unit.html#After=
  addAfter: (value) ->
    @addPair("After", value)

module.exports = SystemDUnitCommon
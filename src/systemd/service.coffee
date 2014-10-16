Common = require("./unit-common")

# Please see ointer.de/public/systemd-man/systemd.service.html
# for any additional options
class SystemDService extends Common
  constructor: ->
    super("Service")

  addEnvironment: (name, value) ->
    @assertString(name, "name")
    @assertString(value, "value")
    @addPair("Environment", "#{name}=#{value}")

  # http://0pointer.de/public/systemd-man/systemd.service.html#Type=
  addType: (value) ->
    @addPair("Type", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#ExecStart=
  addExecStart: (value) ->
    @addPair("ExecStart", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#ExecStartPre=
  addExecStartPre: (value) ->
    @addPair("ExecStartPre", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#ExecStartPre=
  addExecStartPost: (value) ->
    @addPair("ExecStartPost", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#ExecReload=
  addExecReload: (value) ->
    @addPair("ExecReload", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#ExecStop=
  addExecStop: (value) ->
    @addPair("ExecStop", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#ExecStopPost=
  addExecStopPost: (value) ->
    @addPair("ExecStopPost", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#RestartSec=
  addRestartSec: (value) ->
    if typeof value is "number"
      value = "#{parseInt(value)}s"
    @addPair("RestartSec", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#TimeoutStartSec=
  addTimeoutStartSec: (value) ->
    if typeof value is "number"
      value = "#{parseInt(value)}s"
    @addPair("TimeoutStartSec", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#TimeoutStopSec=
  addTimeoutStopSec: (value) ->
    if typeof value is "number"
      value = "#{parseInt(value)}s"
    @addPair("TimeoutStopSec", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#TimeoutSec=
  addTimeoutSec: (value) ->
    if typeof value is "number"
      value = "#{parseInt(value)}s"
    @addPair("TimeoutSec", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#Restart=
  addRestart: (value) ->
    @addPair("Restart", value)

  # http://0pointer.de/public/systemd-man/systemd.service.html#NotifyAccess=
  addNotifyAccess: (value) ->
    @addPair("NotifyAccess", value)

  addEnvironmentFile: (value) ->
    @addPair("EnvironmentFile", value)

  addUser: (value) ->
    @addPair("User", value)




  addLimitNoFile: (value) ->
    if typeof value is "number"
      value = "#{parseInt(value)}"
    @addPair("LimitNOFILE", value)

module.exports = SystemDService
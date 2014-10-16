Service = require("./service")
Unit    = require("./unit")
XFleet    = require("./x-fleet")
Install    = require("./install")

class SystemDUnitFile

  constructor: ->
    Object.defineProperty(this, "options", {
      get: this._getOptions
    })

  service: new Service()
  unit: new Unit()
  xFleet: new XFleet()
  install: new Install()

  _getOptions: ->
    serviceOptions = this.service.options or []
    unitOptions = this.unit.options or []
    xFleetOptions = this.xFleet.options or []
    installOptions = this.install.options or []
    return serviceOptions.concat(
      unitOptions,
      xFleetOptions,
      installOptions
    )

module.exports = SystemDUnitFile
Service = require("./service")
Unit    = require("./unit")
XFleet    = require("./x-fleet")
Install    = require("./install")

class SystemDUnitFile

  constructor: ->
    Object.defineProperty(this, "options", {
      get: this._getOptions
    })
    this.service = new Service()
    this.unit = new Unit()
    this.xFleet = new XFleet()
    this.install = new Install()

  service: null
  unit: null
  xFleet: null
  install: null

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
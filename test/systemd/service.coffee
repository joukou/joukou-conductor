Service           = require( '../../dist/systemd/service')
chai              = require( 'chai' )
expect            = chai.expect

testAddKey = (Section, functionName, key, value, expectedValue) ->
  section = new Section()
  expect(Section.prototype).to.include.key(functionName)
  optionsLength = section.options.length
  section[functionName](value)
  expect(section.options.length).to.equal(optionsLength + 1)
  option = section.options[optionsLength]
  expect(option.section).to.equal(section.section)
  expect(option.name).to.equal(key)
  expect(option.value).to.equal(expectedValue or value)

describe "service", ->
  specify "takes section name", ->
    service = new Service()
    expect(service.section).to.equal("Service")
  specify "add environment", ->
    service = new Service()
    key = "key"
    value = "value"
    service.addEnvironment(key, value)
    expect(service.options.length).to.equal(1)
    expect(service.options[0].name).to.equal("Environment")
    expect(service.options[0].value).to.equal("#{key}=#{value}")
  specify "add Type", ->
    testAddKey(Service, "addType", "Type", "value")
  specify "add ExecStart", ->
    testAddKey(Service, "addExecStart", "ExecStart", "value")
  specify "add ExecStartPre", ->
    testAddKey(Service, "addExecStartPre", "ExecStartPre", "value")
  specify "add ExecStartPost", ->
    testAddKey(Service, "addExecStartPost", "ExecStartPost", "value")
  specify "add ExecReload", ->
    testAddKey(Service, "addExecReload", "ExecReload", "value")
  specify "add ExecStop", ->
    testAddKey(Service, "addExecStop", "ExecStop", "value")
  specify "add ExecStopPost", ->
    testAddKey(Service, "addExecStopPost", "ExecStopPost", "value")
  specify "add RestartSec", ->
    testAddKey(Service, "addRestartSec", "RestartSec", "value")
  specify "add RestartSec s", ->
    testAddKey(Service, "addRestartSec", "RestartSec", 1, "1s")
  specify "add TimeoutStartSec", ->
    testAddKey(Service, "addTimeoutStartSec", "TimeoutStartSec", "value")
  specify "add TimeoutStartSec s", ->
    testAddKey(Service, "addTimeoutStartSec", "TimeoutStartSec", 1, "1s")
  specify "add TimeoutStopSec", ->
    testAddKey(Service, "addTimeoutStopSec", "TimeoutStopSec", "value")
  specify "add TimeoutStopSec s", ->
    testAddKey(Service, "addTimeoutStopSec", "TimeoutStopSec", 1, "1s")
  specify "add TimeoutSec", ->
    testAddKey(Service, "addTimeoutSec", "TimeoutSec", "value")
  specify "add TimeoutSec s", ->
    testAddKey(Service, "addTimeoutSec", "TimeoutSec", 1, "1s")
  specify "add Restart", ->
    testAddKey(Service, "addRestart", "Restart", "value")
  specify "add NotifyAccess", ->
    testAddKey(Service, "addNotifyAccess", "NotifyAccess", "value")
  specify "add EnvironmentFile", ->
    testAddKey(Service, "addEnvironmentFile", "EnvironmentFile", "value")
  specify "add User", ->
    testAddKey(Service, "addUser", "User", "value")
  specify "add LimitNOFILE", ->
    testAddKey(Service, "addLimitNoFile", "LimitNOFILE", "value")
  specify "add LimitNOFILE", ->
    testAddKey(Service, "addLimitNoFile", "LimitNOFILE", 1, "1")

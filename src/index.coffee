###*
@module joukou-conductor/index
@author Fabian Cook <fabian.cook@joukou.com>
@copyright (c) 2009-2014 Joukou Ltd. All rights reserved.
###

joukouETCDConnectionString  = process.env["JOUKOU_ETCD_CONNECTION_STRING"]
joukouNode                  = process.env["JOUKOU_NODE"]

vip                         = require( 'vip' )
conductorClient             = require('./rabbitmq/conductor-client')

if not joukouETCDConnectionString
  joukouETCDConnectionString = "127.0.0.1:4001,127.0.0.1:4002"
  process.env["JOUKOU_ETCD_CONNECTION_STRING"] = joukouETCDConnectionString

start = ->
  vipcontroller = vip('127.0.0.1:4001,127.0.0.1:4002')
  service = vipcontroller(
    id: joukouNode
    path: "/joukou-conductor"
    value: "joukou-conductor-vip_#{joukouNode}"
    ttl: 5
  , startImmediately)

isRunning = no

startImmediately = ->
  if isRunning
    # We are already listening
    return
  isRunning = yes
  conductorClient.listen()

if require.main is module
  start()

module.exports =
  start: start
  startImmediately: startImmediately


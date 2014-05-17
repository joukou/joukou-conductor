###*
Copyright 2014 Joukou Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
###

###*
@module joukou-conductor/index
@author Fabian Cook <fabian.cook@joukou.com>
###

joukouETCDConnectionString  = process.env["JOUKOU_ETCD_CONNECTION_STRING"]
joukouNode                  = process.env["JOUKOU_NODE"]

vip                         = require( 'vip' )
{ ConductorRabbitMQClient } = require('joukou-conductor-rabbitmq')
url                         = require('util')
logger                      = require('logger')
moment                      = require('moment')
prettified                  = require('prettified').errors

if not joukouETCDConnectionString
  joukouETCDConnectionString = "127.0.0.1:4001,127.0.0.1:4002"
  process.env["JOUKOU_ETCD_CONNECTION_STRING"] = joukouETCDConnectionString

if not joukouNode
  joukouNode = "JoukouNode"
  process.env["JOUKOU_NODE"] = joukouNode

process.on("uncaughtException", (err) ->
  console.log("#{moment().format()}:")
  prettified.print(err)
)
process.on("exit", ->
  console.log("Process exiting #{moment().format()}")
)

start = ->
  vipcontroller = vip('127.0.0.1:4001,127.0.0.1:4002')
  service = vipcontroller(
    id: joukouNode
    path: "/joukou-conductor"
    value: "joukou-conductor-vip_#{joukouNode}"
    ttl: 5
  , ->

  )
  service.on("select", (id, value) ->
    startImmediately()
  )
  service.start()

isRunning = no

startImmediately = ->
  if isRunning
    # We are already listening
    return
  isRunning = yes
  ConductorRabbitMQClient.listen()

if require.main is module
  console.log("Process starting #{moment().format()}")
  start()

module.exports =
  start: start
  startImmediately: startImmediately


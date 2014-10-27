amqplib = require('amqplib')
Q       = require('q')
uuid    = require('node-uuid')

class RabbitMQClient
  open: null
  connection: null
  channel: null
  key: null
  exchange: null
  consumer: null
  constructor: (exchange, key) ->
    this.exchange = exchange
    this.key = key
    this.open = amqplib.connect(exchange)
  _setupConnection: ->
    client = this
    this.open.then((con) ->
      client._onConnection.apply(client, [con])
    )
  _onConnection: (connection) ->
    this.connection = connection
  _setupChannel: ->
    client = this
    ok = this.connection.createChannel()
    ok.then((channel) ->
      client._onChannel.apply(client, [channel])
    )
    ok
  _onChannel: (channel) ->
    this.channel = channel
    this.channel.assertQueue(this.key)
  cancel: (consumerTag) ->
    # Not connected
    if not this.channel
      return Q.reject(new Error("Not connected"))
    this.channel.cancel(consumerTag)
  consume: (callback, contentOnly, consumerTag) ->
    if callback not instanceof Function
      throw new TypeError("Callback is expected to be a Function")
    if not consumerTag
      # Create one so they can cancel it
      consumerTag = uuid.v4()
    this.open.then(->
      this.channel.consume(this.key, (message) ->
        # Filter the duds here
        if message is null or message is undefined
          return
        if contentOnly
          message = message.content
        # Check again
        if message is null or message is undefined
          return
        callback(message)
      , consumerTag: consumerTag)
    )
    consumerTag
  send: (message) ->
    if message isnt Buffer
      message = new Buffer(message)
    this.open.then(->
      this.channel.sendToQueue(key, message)
    )
module.exports =
  getClient: (exchange, key) ->
    return new RabbitMQClient(exchange, key)
  RabbitMQClient: RabbitMQClient
###*
@module joukou-conductor/index
@author Isaac Johnston <isaac.johnston@joukou.com>
@copyright (c) 2009-2014 Joukou Ltd. All rights reserved.
###

Q = require( 'q' )

module.exports = ->
  deferred = Q.defer()

  process.nextTick( ->
    deferred.resolve( 42 )
  )

  deferred.promise

/**
@module joukou-conductor/index
@author Isaac Johnston <isaac.johnston@joukou.com>
@copyright (c) 2009-2014 Joukou Ltd. All rights reserved.
 */
var Q;

Q = require('q');

module.exports = function() {
  var deferred;
  deferred = Q.defer();
  process.nextTick(function() {
    return deferred.resolve(42);
  });
  return deferred.promise;
};

/*
//# sourceMappingURL=index.js.map
*/

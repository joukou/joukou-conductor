
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBOzs7O0dBQUE7QUFBQSxJQUFBLENBQUE7O0FBQUEsQ0FNQSxHQUFJLE9BQUEsQ0FBUyxHQUFULENBTkosQ0FBQTs7QUFBQSxNQVFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLFFBQUE7QUFBQSxFQUFBLFFBQUEsR0FBVyxDQUFDLENBQUMsS0FBRixDQUFBLENBQVgsQ0FBQTtBQUFBLEVBRUEsT0FBTyxDQUFDLFFBQVIsQ0FBa0IsU0FBQSxHQUFBO1dBQ2hCLFFBQVEsQ0FBQyxPQUFULENBQWtCLEVBQWxCLEVBRGdCO0VBQUEsQ0FBbEIsQ0FGQSxDQUFBO1NBTUEsUUFBUSxDQUFDLFFBUE07QUFBQSxDQVJqQixDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyMjKlxuQG1vZHVsZSBqb3Vrb3UtY29uZHVjdG9yL2luZGV4XG5AYXV0aG9yIElzYWFjIEpvaG5zdG9uIDxpc2FhYy5qb2huc3RvbkBqb3Vrb3UuY29tPlxuQGNvcHlyaWdodCAoYykgMjAwOS0yMDE0IEpvdWtvdSBMdGQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4jIyNcblxuUSA9IHJlcXVpcmUoICdxJyApXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgZGVmZXJyZWQgPSBRLmRlZmVyKClcblxuICBwcm9jZXNzLm5leHRUaWNrKCAtPlxuICAgIGRlZmVycmVkLnJlc29sdmUoIDQyIClcbiAgKVxuXG4gIGRlZmVycmVkLnByb21pc2UiXX0=
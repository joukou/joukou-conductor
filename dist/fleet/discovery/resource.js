var DiscoveryResource;

DiscoveryResource = (function() {
  DiscoveryResource.prototype.name = "";

  DiscoveryResource.prototype.methods = [];

  DiscoveryResource.prototype.client = null;


  /**
  * @param {string} name
  * @param {Array.<DiscoveryMethod>} methods
   */

  function DiscoveryResource(name, methods, client) {
    this.name = name;
    this.methods = methods;
    this.client = client;
  }

  DiscoveryResource.prototype._attachMethods = function() {
    var key, _results;
    _results = [];
    for (key in this.methods) {
      if (!this.methods.hasOwnProperty(key)) {
        continue;
      }
      _results.push(this._attachMethod(key));
    }
    return _results;
  };

  DiscoveryResource.prototype._attachMethod = function(key) {
    var resource;
    resource = this;
    return this[key] = function() {
      var method;
      method = resource.methods[key];
      return method.callMethod.apply(method, arguments);
    };
  };

  DiscoveryResource.prototype.getMethod = function(name) {
    return this.methods[name];
  };

  DiscoveryResource.prototype.hasMethod = function(name) {
    return !!this.methods[name];
  };

  return DiscoveryResource;

})();

module.exports = DiscoveryResource;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS9yZXNvdXJjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBQSxpQkFBQTs7QUFBQTtBQUNFLDhCQUFBLElBQUEsR0FBTSxFQUFOLENBQUE7O0FBQUEsOEJBQ0EsT0FBQSxHQUFTLEVBRFQsQ0FBQTs7QUFBQSw4QkFFQSxNQUFBLEdBQVEsSUFGUixDQUFBOztBQUdBO0FBQUE7OztLQUhBOztBQU9hLEVBQUEsMkJBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsTUFBaEIsR0FBQTtBQUNYLElBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFaLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxPQUFMLEdBQWUsT0FEZixDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsTUFBTCxHQUFjLE1BRmQsQ0FEVztFQUFBLENBUGI7O0FBQUEsOEJBV0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLGFBQUE7QUFBQTtTQUFBLG1CQUFBLEdBQUE7QUFDRSxNQUFBLElBQUcsQ0FBQSxJQUFRLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsR0FBNUIsQ0FBUDtBQUNFLGlCQURGO09BQUE7QUFBQSxvQkFFQSxJQUFJLENBQUMsYUFBTCxDQUFtQixHQUFuQixFQUZBLENBREY7QUFBQTtvQkFEYztFQUFBLENBWGhCLENBQUE7O0FBQUEsOEJBZ0JBLGFBQUEsR0FBZSxTQUFDLEdBQUQsR0FBQTtBQUNiLFFBQUEsUUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTtXQUNBLElBQUssQ0FBQSxHQUFBLENBQUwsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxRQUFRLENBQUMsT0FBUSxDQUFBLEdBQUEsQ0FBMUIsQ0FBQTtBQUNBLGFBQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFsQixDQUF3QixNQUF4QixFQUFnQyxTQUFoQyxDQUFQLENBRlU7SUFBQSxFQUZDO0VBQUEsQ0FoQmYsQ0FBQTs7QUFBQSw4QkFxQkEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsV0FBTyxJQUFJLENBQUMsT0FBUSxDQUFBLElBQUEsQ0FBcEIsQ0FEUztFQUFBLENBckJYLENBQUE7O0FBQUEsOEJBdUJBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFdBQU8sQ0FBQSxDQUFDLElBQUssQ0FBQyxPQUFRLENBQUEsSUFBQSxDQUF0QixDQURTO0VBQUEsQ0F2QlgsQ0FBQTs7MkJBQUE7O0lBREYsQ0FBQTs7QUFBQSxNQTJCTSxDQUFDLE9BQVAsR0FBaUIsaUJBM0JqQixDQUFBIiwiZmlsZSI6ImZsZWV0L2Rpc2NvdmVyeS9yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIlxuY2xhc3MgRGlzY292ZXJ5UmVzb3VyY2VcbiAgbmFtZTogXCJcIlxuICBtZXRob2RzOiBbXVxuICBjbGllbnQ6IG51bGxcbiAgIyMjKlxuICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICogQHBhcmFtIHtBcnJheS48RGlzY292ZXJ5TWV0aG9kPn0gbWV0aG9kc1xuICAjIyNcbiAgY29uc3RydWN0b3I6IChuYW1lLCBtZXRob2RzLCBjbGllbnQpIC0+XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMubWV0aG9kcyA9IG1ldGhvZHNcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudFxuICBfYXR0YWNoTWV0aG9kczogLT5cbiAgICBmb3Iga2V5IG9mIHRoaXMubWV0aG9kc1xuICAgICAgaWYgbm90IHRoaXMubWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShrZXkpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB0aGlzLl9hdHRhY2hNZXRob2Qoa2V5KVxuICBfYXR0YWNoTWV0aG9kOiAoa2V5KSAtPlxuICAgIHJlc291cmNlID0gdGhpc1xuICAgIHRoaXNba2V5XSA9IC0+XG4gICAgICBtZXRob2QgPSByZXNvdXJjZS5tZXRob2RzW2tleV1cbiAgICAgIHJldHVybiBtZXRob2QuY2FsbE1ldGhvZC5hcHBseShtZXRob2QsIGFyZ3VtZW50cylcbiAgZ2V0TWV0aG9kOiAobmFtZSkgLT5cbiAgICByZXR1cm4gdGhpcy5tZXRob2RzW25hbWVdXG4gIGhhc01ldGhvZDogKG5hbWUpIC0+XG4gICAgcmV0dXJuICEhdGhpcy5tZXRob2RzW25hbWVdXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzY292ZXJ5UmVzb3VyY2UiXX0=
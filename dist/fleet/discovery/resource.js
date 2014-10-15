var DiscoveryResource, Q;

Q = require("q");

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
    this._attachMethods();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS9yZXNvdXJjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxvQkFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLEdBQVIsQ0FBSixDQUFBOztBQUFBO0FBR0UsOEJBQUEsSUFBQSxHQUFNLEVBQU4sQ0FBQTs7QUFBQSw4QkFDQSxPQUFBLEdBQVMsRUFEVCxDQUFBOztBQUFBLDhCQUVBLE1BQUEsR0FBUSxJQUZSLENBQUE7O0FBR0E7QUFBQTs7O0tBSEE7O0FBT2EsRUFBQSwyQkFBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixNQUFoQixHQUFBO0FBQ1gsSUFBQSxJQUFJLENBQUMsSUFBTCxHQUFZLElBQVosQ0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxPQURmLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxNQUFMLEdBQWMsTUFGZCxDQUFBO0FBQUEsSUFHQSxJQUFJLENBQUMsY0FBTCxDQUFBLENBSEEsQ0FEVztFQUFBLENBUGI7O0FBQUEsOEJBWUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLGFBQUE7QUFBQTtTQUFBLG1CQUFBLEdBQUE7QUFDRSxNQUFBLElBQUcsQ0FBQSxJQUFRLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsR0FBNUIsQ0FBUDtBQUNFLGlCQURGO09BQUE7QUFBQSxvQkFFQSxJQUFJLENBQUMsYUFBTCxDQUFtQixHQUFuQixFQUZBLENBREY7QUFBQTtvQkFEYztFQUFBLENBWmhCLENBQUE7O0FBQUEsOEJBaUJBLGFBQUEsR0FBZSxTQUFDLEdBQUQsR0FBQTtBQUNiLFFBQUEsUUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTtXQUNBLElBQUssQ0FBQSxHQUFBLENBQUwsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxRQUFRLENBQUMsT0FBUSxDQUFBLEdBQUEsQ0FBMUIsQ0FBQTthQUNBLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBbEIsQ0FBd0IsTUFBeEIsRUFBZ0MsU0FBaEMsRUFGVTtJQUFBLEVBRkM7RUFBQSxDQWpCZixDQUFBOztBQUFBLDhCQXNCQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxXQUFPLElBQUksQ0FBQyxPQUFRLENBQUEsSUFBQSxDQUFwQixDQURTO0VBQUEsQ0F0QlgsQ0FBQTs7QUFBQSw4QkF3QkEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsV0FBTyxDQUFBLENBQUMsSUFBSyxDQUFDLE9BQVEsQ0FBQSxJQUFBLENBQXRCLENBRFM7RUFBQSxDQXhCWCxDQUFBOzsyQkFBQTs7SUFIRixDQUFBOztBQUFBLE1BOEJNLENBQUMsT0FBUCxHQUFpQixpQkE5QmpCLENBQUEiLCJmaWxlIjoiZmxlZXQvZGlzY292ZXJ5L3Jlc291cmNlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiUSA9IHJlcXVpcmUoXCJxXCIpXG5cbmNsYXNzIERpc2NvdmVyeVJlc291cmNlXG4gIG5hbWU6IFwiXCJcbiAgbWV0aG9kczogW11cbiAgY2xpZW50OiBudWxsXG4gICMjIypcbiAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAqIEBwYXJhbSB7QXJyYXkuPERpc2NvdmVyeU1ldGhvZD59IG1ldGhvZHNcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAobmFtZSwgbWV0aG9kcywgY2xpZW50KSAtPlxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLm1ldGhvZHMgPSBtZXRob2RzXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnRcbiAgICB0aGlzLl9hdHRhY2hNZXRob2RzKClcbiAgX2F0dGFjaE1ldGhvZHM6IC0+XG4gICAgZm9yIGtleSBvZiB0aGlzLm1ldGhvZHNcbiAgICAgIGlmIG5vdCB0aGlzLm1ldGhvZHMuaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICBjb250aW51ZVxuICAgICAgdGhpcy5fYXR0YWNoTWV0aG9kKGtleSlcbiAgX2F0dGFjaE1ldGhvZDogKGtleSkgLT5cbiAgICByZXNvdXJjZSA9IHRoaXNcbiAgICB0aGlzW2tleV0gPSAtPlxuICAgICAgbWV0aG9kID0gcmVzb3VyY2UubWV0aG9kc1trZXldXG4gICAgICBtZXRob2QuY2FsbE1ldGhvZC5hcHBseShtZXRob2QsIGFyZ3VtZW50cylcbiAgZ2V0TWV0aG9kOiAobmFtZSkgLT5cbiAgICByZXR1cm4gdGhpcy5tZXRob2RzW25hbWVdXG4gIGhhc01ldGhvZDogKG5hbWUpIC0+XG4gICAgcmV0dXJuICEhdGhpcy5tZXRob2RzW25hbWVdXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzY292ZXJ5UmVzb3VyY2UiXX0=
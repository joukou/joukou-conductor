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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS9yZXNvdXJjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpQkFBQTs7QUFBQTtBQUNFLDhCQUFBLElBQUEsR0FBTSxFQUFOLENBQUE7O0FBQUEsOEJBQ0EsT0FBQSxHQUFTLEVBRFQsQ0FBQTs7QUFBQSw4QkFFQSxNQUFBLEdBQVEsSUFGUixDQUFBOztBQUdBO0FBQUE7OztLQUhBOztBQU9hLEVBQUEsMkJBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsTUFBaEIsR0FBQTtBQUNYLElBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFaLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxPQUFMLEdBQWUsT0FEZixDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsTUFBTCxHQUFjLE1BRmQsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLGNBQUwsQ0FBQSxDQUhBLENBRFc7RUFBQSxDQVBiOztBQUFBLDhCQVlBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsUUFBQSxhQUFBO0FBQUE7U0FBQSxtQkFBQSxHQUFBO0FBQ0UsTUFBQSxJQUFHLENBQUEsSUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLEdBQTVCLENBQVA7QUFDRSxpQkFERjtPQUFBO0FBQUEsb0JBRUEsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsR0FBbkIsRUFGQSxDQURGO0FBQUE7b0JBRGM7RUFBQSxDQVpoQixDQUFBOztBQUFBLDhCQWlCQSxhQUFBLEdBQWUsU0FBQyxHQUFELEdBQUE7QUFDYixRQUFBLFFBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFYLENBQUE7V0FDQSxJQUFLLENBQUEsR0FBQSxDQUFMLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE9BQVEsQ0FBQSxHQUFBLENBQTFCLENBQUE7YUFDQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQWxCLENBQXdCLE1BQXhCLEVBQWdDLFNBQWhDLEVBRlU7SUFBQSxFQUZDO0VBQUEsQ0FqQmYsQ0FBQTs7QUFBQSw4QkFzQkEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsV0FBTyxJQUFJLENBQUMsT0FBUSxDQUFBLElBQUEsQ0FBcEIsQ0FEUztFQUFBLENBdEJYLENBQUE7O0FBQUEsOEJBd0JBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFdBQU8sQ0FBQSxDQUFDLElBQUssQ0FBQyxPQUFRLENBQUEsSUFBQSxDQUF0QixDQURTO0VBQUEsQ0F4QlgsQ0FBQTs7MkJBQUE7O0lBREYsQ0FBQTs7QUFBQSxNQTRCTSxDQUFDLE9BQVAsR0FBaUIsaUJBNUJqQixDQUFBIiwiZmlsZSI6ImZsZWV0L2Rpc2NvdmVyeS9yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERpc2NvdmVyeVJlc291cmNlXG4gIG5hbWU6IFwiXCJcbiAgbWV0aG9kczogW11cbiAgY2xpZW50OiBudWxsXG4gICMjIypcbiAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAqIEBwYXJhbSB7QXJyYXkuPERpc2NvdmVyeU1ldGhvZD59IG1ldGhvZHNcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAobmFtZSwgbWV0aG9kcywgY2xpZW50KSAtPlxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLm1ldGhvZHMgPSBtZXRob2RzXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnRcbiAgICB0aGlzLl9hdHRhY2hNZXRob2RzKClcbiAgX2F0dGFjaE1ldGhvZHM6IC0+XG4gICAgZm9yIGtleSBvZiB0aGlzLm1ldGhvZHNcbiAgICAgIGlmIG5vdCB0aGlzLm1ldGhvZHMuaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICBjb250aW51ZVxuICAgICAgdGhpcy5fYXR0YWNoTWV0aG9kKGtleSlcbiAgX2F0dGFjaE1ldGhvZDogKGtleSkgLT5cbiAgICByZXNvdXJjZSA9IHRoaXNcbiAgICB0aGlzW2tleV0gPSAtPlxuICAgICAgbWV0aG9kID0gcmVzb3VyY2UubWV0aG9kc1trZXldXG4gICAgICBtZXRob2QuY2FsbE1ldGhvZC5hcHBseShtZXRob2QsIGFyZ3VtZW50cylcbiAgZ2V0TWV0aG9kOiAobmFtZSkgLT5cbiAgICByZXR1cm4gdGhpcy5tZXRob2RzW25hbWVdXG4gIGhhc01ldGhvZDogKG5hbWUpIC0+XG4gICAgcmV0dXJuICEhdGhpcy5tZXRob2RzW25hbWVdXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzY292ZXJ5UmVzb3VyY2UiXX0=
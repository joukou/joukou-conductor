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
    var methodName, _results;
    _results = [];
    for (methodName in this.methods) {
      if (!this.methods.hasOwnProperty(methodName)) {
        continue;
      }
      _results.push(this._attachMethod(methodName));
    }
    return _results;
  };

  DiscoveryResource.prototype._attachMethod = function(methodName) {
    return this[methodName] = this.wrapCallMethod(methodName);
  };

  DiscoveryResource.prototype.wrapCallMethod = function(methodName) {
    var resource;
    resource = this;
    return function() {
      var method;
      method = resource.methods[methodName];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS9yZXNvdXJjZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpQkFBQTs7QUFBQTtBQUNFLDhCQUFBLElBQUEsR0FBTSxFQUFOLENBQUE7O0FBQUEsOEJBQ0EsT0FBQSxHQUFTLEVBRFQsQ0FBQTs7QUFBQSw4QkFFQSxNQUFBLEdBQVEsSUFGUixDQUFBOztBQUdBO0FBQUE7OztLQUhBOztBQU9hLEVBQUEsMkJBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsTUFBaEIsR0FBQTtBQUNYLElBQUEsSUFBSSxDQUFDLElBQUwsR0FBWSxJQUFaLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxPQUFMLEdBQWUsT0FEZixDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsTUFBTCxHQUFjLE1BRmQsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLGNBQUwsQ0FBQSxDQUhBLENBRFc7RUFBQSxDQVBiOztBQUFBLDhCQVlBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsUUFBQSxvQkFBQTtBQUFBO1NBQUEsMEJBQUEsR0FBQTtBQUNFLE1BQUEsSUFBRyxDQUFBLElBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixVQUE1QixDQUFQO0FBQ0UsaUJBREY7T0FBQTtBQUFBLG9CQUVBLElBQUksQ0FBQyxhQUFMLENBQW1CLFVBQW5CLEVBRkEsQ0FERjtBQUFBO29CQURjO0VBQUEsQ0FaaEIsQ0FBQTs7QUFBQSw4QkFpQkEsYUFBQSxHQUFlLFNBQUMsVUFBRCxHQUFBO1dBQ2IsSUFBSyxDQUFBLFVBQUEsQ0FBTCxHQUFtQixJQUFJLENBQUMsY0FBTCxDQUFvQixVQUFwQixFQUROO0VBQUEsQ0FqQmYsQ0FBQTs7QUFBQSw4QkFtQkEsY0FBQSxHQUFnQixTQUFDLFVBQUQsR0FBQTtBQUNkLFFBQUEsUUFBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTtBQUNBLFdBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE9BQVEsQ0FBQSxVQUFBLENBQTFCLENBQUE7YUFDQSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQWxCLENBQXdCLE1BQXhCLEVBQWdDLFNBQWhDLEVBRks7SUFBQSxDQUFQLENBRmM7RUFBQSxDQW5CaEIsQ0FBQTs7QUFBQSw4QkF3QkEsU0FBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsV0FBTyxJQUFJLENBQUMsT0FBUSxDQUFBLElBQUEsQ0FBcEIsQ0FEUztFQUFBLENBeEJYLENBQUE7O0FBQUEsOEJBMEJBLFNBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFdBQU8sQ0FBQSxDQUFDLElBQUssQ0FBQyxPQUFRLENBQUEsSUFBQSxDQUF0QixDQURTO0VBQUEsQ0ExQlgsQ0FBQTs7MkJBQUE7O0lBREYsQ0FBQTs7QUFBQSxNQThCTSxDQUFDLE9BQVAsR0FBaUIsaUJBOUJqQixDQUFBIiwiZmlsZSI6ImZsZWV0L2Rpc2NvdmVyeS9yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIERpc2NvdmVyeVJlc291cmNlXG4gIG5hbWU6IFwiXCJcbiAgbWV0aG9kczogW11cbiAgY2xpZW50OiBudWxsXG4gICMjIypcbiAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAqIEBwYXJhbSB7QXJyYXkuPERpc2NvdmVyeU1ldGhvZD59IG1ldGhvZHNcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAobmFtZSwgbWV0aG9kcywgY2xpZW50KSAtPlxuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLm1ldGhvZHMgPSBtZXRob2RzXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnRcbiAgICB0aGlzLl9hdHRhY2hNZXRob2RzKClcbiAgX2F0dGFjaE1ldGhvZHM6IC0+XG4gICAgZm9yIG1ldGhvZE5hbWUgb2YgdGhpcy5tZXRob2RzXG4gICAgICBpZiBub3QgdGhpcy5tZXRob2RzLmhhc093blByb3BlcnR5KG1ldGhvZE5hbWUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB0aGlzLl9hdHRhY2hNZXRob2QobWV0aG9kTmFtZSlcbiAgX2F0dGFjaE1ldGhvZDogKG1ldGhvZE5hbWUpIC0+XG4gICAgdGhpc1ttZXRob2ROYW1lXSA9IHRoaXMud3JhcENhbGxNZXRob2QobWV0aG9kTmFtZSlcbiAgd3JhcENhbGxNZXRob2Q6IChtZXRob2ROYW1lKSAtPlxuICAgIHJlc291cmNlID0gdGhpc1xuICAgIHJldHVybiAtPlxuICAgICAgbWV0aG9kID0gcmVzb3VyY2UubWV0aG9kc1ttZXRob2ROYW1lXVxuICAgICAgbWV0aG9kLmNhbGxNZXRob2QuYXBwbHkobWV0aG9kLCBhcmd1bWVudHMpXG4gIGdldE1ldGhvZDogKG5hbWUpIC0+XG4gICAgcmV0dXJuIHRoaXMubWV0aG9kc1tuYW1lXVxuICBoYXNNZXRob2Q6IChuYW1lKSAtPlxuICAgIHJldHVybiAhIXRoaXMubWV0aG9kc1tuYW1lXVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpc2NvdmVyeVJlc291cmNlIl19
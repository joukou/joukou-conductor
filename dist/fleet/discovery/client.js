var DiscoveryClient, DiscoveryMethod, DiscoveryResource, DiscoverySchema, Q, request, _;

Q = require("q");

request = require("request");

DiscoveryResource = require("./resource");

DiscoveryMethod = require("./method");

DiscoverySchema = require("./schema");

_ = require("lodash");

DiscoveryClient = (function() {
  DiscoveryClient.prototype.kind = "";

  DiscoveryClient.prototype.discoveryVersion = "";

  DiscoveryClient.prototype.id = "";

  DiscoveryClient.prototype.name = "";

  DiscoveryClient.prototype.version = "";

  DiscoveryClient.prototype.title = "";

  DiscoveryClient.prototype.description = "";

  DiscoveryClient.prototype.documentLink = "";

  DiscoveryClient.prototype.protocol = "";

  DiscoveryClient.prototype.baseUrl = "";

  DiscoveryClient.prototype.basePath = "";

  DiscoveryClient.prototype.rootUrl = "";

  DiscoveryClient.prototype.servicePath = "";

  DiscoveryClient.prototype.batchPath = "";

  DiscoveryClient.prototype.endpoint = "";

  DiscoveryClient.prototype.resources = {};

  DiscoveryClient.prototype.schemas = {};

  DiscoveryClient.prototype._complete = false;

  DiscoveryClient.prototype._error = null;

  DiscoveryClient.prototype._discovering = false;

  DiscoveryClient.prototype._resolveOnDiscovery = [];

  DiscoveryClient.prototype._request = request;


  /**
  @param {string} endpoint
  @param {string} [basePath='/v1-alpha/']
  @param {boolean} [doDiscovery=false]
   */

  function DiscoveryClient(endpoint, basePath, doDiscovery) {
    this.endpoint = endpoint;
    this.basePath = basePath;
    this._validateEndpoint();
    if (doDiscovery) {
      this.doDiscovery();
    }
  }

  DiscoveryClient.prototype._validateEndpoint = function() {
    if (!this.endpoint) {
      throw new Error("Endpoint is required");
    }
    if (typeof this.endpoint !== "string") {
      throw new TypeError("Endpoint is expected to be a string");
    }
    if (this.basePath === null || this.basePath === void 0) {
      this.basePath = "/v1-alpha/";
    } else if (typeof this.basePath !== "string") {
      throw new TypeError("Base path is expected to be a string");
    }
    if (this._lastCharacter(this.endpoint) === "/") {
      this.endpoint = this._stripLastCharacter(this.endpoint);
    }
    if (this._firstCharacter(this.basePath) !== "/") {
      this.basePath = "/" + this.basePath;
    }
    if (this._lastCharacter(this.basePath) !== "/") {
      return this.basePath = "" + this.basePath + "/";
    }
  };

  DiscoveryClient.prototype._stripLastCharacter = function(str) {
    var length;
    if (!str || typeof str !== "string") {
      return "";
    }
    length = str.length;
    return str.substring(0, length - 1);
  };

  DiscoveryClient.prototype._firstCharacter = function(str) {
    if (!str || typeof str !== "string") {
      return null;
    }
    return str.substring(0, 1);
  };

  DiscoveryClient.prototype._lastCharacter = function(str) {
    var length;
    if (!str || typeof str !== "string") {
      return null;
    }
    length = str.length;
    return str.substring(length - 1, length);
  };

  DiscoveryClient.prototype.doDiscovery = function() {
    var deferred;
    deferred = Q.defer();
    if (this._complete) {
      if (this._error) {
        deferred.reject(this._error);
      } else {
        deferred.resolve(this);
      }
      return deferred.promise;
    }
    this._resolveOnDiscovery.push(deferred);
    if (this._discovering) {
      return deferred.promise;
    }
    this._discovering = true;
    this._doDiscoveryRequest();
    return deferred.promise;
  };

  DiscoveryClient.prototype._doDiscoveryRequest = function() {
    var client;
    client = this;
    return this._request.get("" + this.endpoint + this.basePath + "discovery.json", function(error, response, body) {
      return client._onDiscoveryResult(error, response, body);
    });
  };

  DiscoveryClient.prototype._rejectWithError = function(error) {
    var i, _i, _len, _ref;
    this._error = error;
    this._complete = true;
    this._discovering = false;
    _ref = this._resolveOnDiscovery;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      i.reject(error);
    }
    return this._resolveOnDiscovery = [];
  };

  DiscoveryClient.prototype._resolve = function() {
    var i, _i, _len, _ref;
    this._error = null;
    this._complete = true;
    this._discovering = false;
    _ref = this._resolveOnDiscovery;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      i.resolve(this);
    }
    return this._resolveOnDiscovery = [];
  };

  DiscoveryClient.prototype._onDiscoveryResult = function(error, response, body) {
    var err, jsonBody;
    if (!error && response.statusCode !== 200) {
      error = new Error("Failed to get discovery.json");
    }
    if (!error && !body) {
      error = new Error("Discovery body is empty");
    }
    if (error) {
      this._rejectWithError(error);
      return;
    }
    jsonBody = null;
    try {
      jsonBody = JSON.parse(body);
    } catch (_error) {
      err = _error;
      this._rejectWithError(err);
      return;
    }
    if (!_.isPlainObject(jsonBody)) {
      this._rejectWithError(new Error("discovery.json body not an object"));
      return;
    }
    try {
      this.resources = this._resolveDiscovery(jsonBody);
    } catch (_error) {
      err = _error;
      this._rejectWithError(err);
      return;
    }
    this._attachResources();
    return this._resolve();
  };

  DiscoveryClient.prototype.onDiscovery = function() {
    var deferred;
    deferred = Q.defer();
    if (this._complete) {
      if (this._error) {
        deferred.reject(this._error);
      } else {
        deferred.resolve(this);
      }
    } else if (this._discovering) {
      this._resolveOnDiscovery.push(deferred);
    }
    return deferred.promise;
  };

  DiscoveryClient.prototype._attachResources = function() {
    var key, _results;
    _results = [];
    for (key in this.resources) {
      if (!this.resources.hasOwnProperty(key)) {
        continue;
      }
      _results.push(this[key] = this.resources[key]);
    }
    return _results;
  };

  DiscoveryClient.prototype._resolveDiscovery = function(discovery) {
    if (!discovery || !_.isPlainObject(discovery)) {
      throw new TypeError("Discovery not instanceof an object");
    }
    return this._resolveResources(discovery.resources);
  };

  DiscoveryClient.prototype._resolveResources = function(resources) {
    var resource, resourceName, resultResources;
    if (!_.isPlainObject(resources)) {
      throw new TypeError("Resources not an object");
    }
    resultResources = {};
    for (resourceName in resources) {
      if (!resources.hasOwnProperty(resourceName)) {
        continue;
      }
      resource = this._resolveResource(resourceName, resources[resourceName]);
      if (resource) {
        resultResources[resourceName] = resource;
      }
    }
    return resultResources;
  };

  DiscoveryClient.prototype._resolveResource = function(resourceName, resource) {
    var method, methodName, resultMethods;
    if (!_.isPlainObject(resource) || !_.isPlainObject(resource.methods)) {
      return null;
    }
    resultMethods = {};
    for (methodName in resource.methods) {
      if (!resource.methods.hasOwnProperty(methodName)) {
        continue;
      }
      method = null;
      try {
        method = this._resolveMethod(methodName, resource.methods[methodName]);
      } catch (_error) {
        continue;
      }
      if (method) {
        resultMethods[methodName] = method;
      }
    }
    return new DiscoveryResource(resourceName, resultMethods, this);
  };

  DiscoveryClient.prototype._resolveMethod = function(methodName, method) {
    if (!_.isPlainObject(method)) {
      return null;
    }
    return new DiscoveryMethod(method.id, method.description, method.httpMethod, method.path, method.parameters, method.parameterOrder, method.request, method.response, this);
  };

  DiscoveryClient.prototype._resolveSchemas = function(schemas) {
    var resultSchemas, schema, schemaName;
    if (!_.isPlainObject(schemas)) {
      throw new TypeError("Schemas not an object");
    }
    resultSchemas = {};
    for (schemaName in schemas) {
      if (!schemas.hasOwnProperty(schemaName)) {
        continue;
      }
      schema = null;
      try {
        schema = this._resolveSchema(schemaName, schemas[schemaName]);
      } catch (_error) {
        continue;
      }
      if (schema) {
        resultSchemas[schemaName] = schema;
      }
    }
    return this.schemas = resultSchemas;
  };

  DiscoveryClient.prototype._resolveSchema = function(schemaName, schema) {
    if (!_.isPlainObject(schema)) {
      return null;
    }
    return new DiscoverySchema(schema.id, schema.type, schema.properties, this);
  };

  DiscoveryClient.prototype.getSchema = function(name) {
    return this.schemas[name];
  };

  DiscoveryClient.prototype.hasSchema = function(name) {
    return !!this.schemas[name];
  };

  DiscoveryClient.prototype.getResource = function(name) {
    return this.resources[name];
  };

  DiscoveryClient.prototype.hasResource = function(name) {
    return !!this.resources[name];
  };

  return DiscoveryClient;

})();

module.exports = {

  /**
  @param {string} endpoint
  @param {string} [basePath='/v1-alpha/']
  @param {boolean} [doDiscovery=false]
   */
  getClient: function(endpoint, basePath, doDiscovery) {
    return new DiscoveryClient(endpoint, basePath, doDiscovery);
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS9jbGllbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsbUZBQUE7O0FBQUEsQ0FBQSxHQUFvQixPQUFBLENBQVEsR0FBUixDQUFwQixDQUFBOztBQUFBLE9BQ0EsR0FBb0IsT0FBQSxDQUFRLFNBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxpQkFFQSxHQUFvQixPQUFBLENBQVEsWUFBUixDQUZwQixDQUFBOztBQUFBLGVBR0EsR0FBb0IsT0FBQSxDQUFRLFVBQVIsQ0FIcEIsQ0FBQTs7QUFBQSxlQUlBLEdBQW9CLE9BQUEsQ0FBUSxVQUFSLENBSnBCLENBQUE7O0FBQUEsQ0FLQSxHQUFvQixPQUFBLENBQVEsUUFBUixDQUxwQixDQUFBOztBQUFBO0FBU0UsNEJBQUEsSUFBQSxHQUFNLEVBQU4sQ0FBQTs7QUFBQSw0QkFDQSxnQkFBQSxHQUFrQixFQURsQixDQUFBOztBQUFBLDRCQUVBLEVBQUEsR0FBSSxFQUZKLENBQUE7O0FBQUEsNEJBR0EsSUFBQSxHQUFNLEVBSE4sQ0FBQTs7QUFBQSw0QkFJQSxPQUFBLEdBQVMsRUFKVCxDQUFBOztBQUFBLDRCQUtBLEtBQUEsR0FBTyxFQUxQLENBQUE7O0FBQUEsNEJBTUEsV0FBQSxHQUFhLEVBTmIsQ0FBQTs7QUFBQSw0QkFPQSxZQUFBLEdBQWMsRUFQZCxDQUFBOztBQUFBLDRCQVFBLFFBQUEsR0FBVSxFQVJWLENBQUE7O0FBQUEsNEJBU0EsT0FBQSxHQUFTLEVBVFQsQ0FBQTs7QUFBQSw0QkFVQSxRQUFBLEdBQVUsRUFWVixDQUFBOztBQUFBLDRCQVdBLE9BQUEsR0FBUyxFQVhULENBQUE7O0FBQUEsNEJBWUEsV0FBQSxHQUFhLEVBWmIsQ0FBQTs7QUFBQSw0QkFhQSxTQUFBLEdBQVcsRUFiWCxDQUFBOztBQUFBLDRCQWNBLFFBQUEsR0FBVSxFQWRWLENBQUE7O0FBQUEsNEJBZUEsU0FBQSxHQUFXLEVBZlgsQ0FBQTs7QUFBQSw0QkFnQkEsT0FBQSxHQUFTLEVB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LFNBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsV0FBckIsR0FBQTtXQUNMLElBQUEsZUFBQSxDQUFnQixRQUFoQixFQUEwQixRQUExQixFQUFvQyxXQUFwQyxFQURLO0VBQUEsQ0FMWDtDQXJPRixDQUFBIiwiZmlsZSI6ImZsZWV0L2Rpc2NvdmVyeS9jbGllbnQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJRICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoXCJxXCIpXG5yZXF1ZXN0ICAgICAgICAgICA9IHJlcXVpcmUoXCJyZXF1ZXN0XCIpXG5EaXNjb3ZlcnlSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL3Jlc291cmNlXCIpXG5EaXNjb3ZlcnlNZXRob2QgICA9IHJlcXVpcmUoXCIuL21ldGhvZFwiKVxuRGlzY292ZXJ5U2NoZW1hICAgPSByZXF1aXJlKFwiLi9zY2hlbWFcIilcbl8gICAgICAgICAgICAgICAgID0gcmVxdWlyZShcImxvZGFzaFwiKVxuXG5jbGFzcyBEaXNjb3ZlcnlDbGllbnRcbiAgIyBTVEFSVCBWYWx1ZXMgZnJvbSBkaXNjb3ZlcnkuanNvblxuICBraW5kOiBcIlwiXG4gIGRpc2NvdmVyeVZlcnNpb246IFwiXCJcbiAgaWQ6IFwiXCJcbiAgbmFtZTogXCJcIlxuICB2ZXJzaW9uOiBcIlwiXG4gIHRpdGxlOiBcIlwiXG4gIGRlc2NyaXB0aW9uOiBcIlwiXG4gIGRvY3VtZW50TGluazogXCJcIlxuICBwcm90b2NvbDogXCJcIlxuICBiYXNlVXJsOiBcIlwiXG4gIGJhc2VQYXRoOiBcIlwiXG4gIHJvb3RVcmw6IFwiXCJcbiAgc2VydmljZVBhdGg6IFwiXCJcbiAgYmF0Y2hQYXRoOiBcIlwiXG4gIGVuZHBvaW50OiBcIlwiXG4gIHJlc291cmNlczoge31cbiAgc2NoZW1hczoge31cbiAgIyBFTkQgVmFsdWVzIGZyb20gZGlzY292ZXIuanNvblxuICAjIFNUQVJUIFwiUHJpdmF0ZVwiIHZhcmlhYmxlc1xuICBfY29tcGxldGU6IGZhbHNlXG4gIF9lcnJvcjogbnVsbFxuICBfZGlzY292ZXJpbmc6IGZhbHNlXG4gIF9yZXNvbHZlT25EaXNjb3Zlcnk6IFtdXG4gIF9yZXF1ZXN0OiByZXF1ZXN0XG4gICMgRU5EIFwiUHJpdmF0ZVwiIHZhcmlhYmxlc1xuICAjIyMqXG4gIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludFxuICBAcGFyYW0ge3N0cmluZ30gW2Jhc2VQYXRoPScvdjEtYWxwaGEvJ11cbiAgQHBhcmFtIHtib29sZWFufSBbZG9EaXNjb3Zlcnk9ZmFsc2VdXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKGVuZHBvaW50LCBiYXNlUGF0aCwgZG9EaXNjb3ZlcnkpIC0+XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50XG4gICAgdGhpcy5iYXNlUGF0aCA9IGJhc2VQYXRoXG4gICAgdGhpcy5fdmFsaWRhdGVFbmRwb2ludCgpXG4gICAgaWYgZG9EaXNjb3ZlcnlcbiAgICAgIHRoaXMuZG9EaXNjb3ZlcnkoKVxuICBfdmFsaWRhdGVFbmRwb2ludDogLT5cbiAgICBpZiBub3QgdGhpcy5lbmRwb2ludFxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW5kcG9pbnQgaXMgcmVxdWlyZWRcIilcbiAgICBpZiB0eXBlb2YgdGhpcy5lbmRwb2ludCBpc250IFwic3RyaW5nXCJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFbmRwb2ludCBpcyBleHBlY3RlZCB0byBiZSBhIHN0cmluZ1wiKVxuICAgIGlmIHRoaXMuYmFzZVBhdGggaXMgbnVsbCBvciB0aGlzLmJhc2VQYXRoIGlzIHVuZGVmaW5lZFxuICAgICAgdGhpcy5iYXNlUGF0aCA9IFwiL3YxLWFscGhhL1wiXG4gICAgZWxzZSBpZiB0eXBlb2YgdGhpcy5iYXNlUGF0aCBpc250IFwic3RyaW5nXCJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJCYXNlIHBhdGggaXMgZXhwZWN0ZWQgdG8gYmUgYSBzdHJpbmdcIilcbiAgICBpZiB0aGlzLl9sYXN0Q2hhcmFjdGVyKHRoaXMuZW5kcG9pbnQpIGlzIFwiL1wiXG4gICAgICB0aGlzLmVuZHBvaW50ID0gdGhpcy5fc3RyaXBMYXN0Q2hhcmFjdGVyKHRoaXMuZW5kcG9pbnQpXG4gICAgIyBFbnN1cmUgYmFzZVBhdGggaGFzIGF0IGxlYXN0IFwiL1wiXG4gICAgIyBvciBpcyBcIi8je3BhdGh9L1wiXG4gICAgaWYgdGhpcy5fZmlyc3RDaGFyYWN0ZXIodGhpcy5iYXNlUGF0aCkgaXNudCBcIi9cIlxuICAgICAgdGhpcy5iYXNlUGF0aCA9IFwiLyN7dGhpcy5iYXNlUGF0aH1cIlxuICAgIGlmIHRoaXMuX2xhc3RDaGFyYWN0ZXIodGhpcy5iYXNlUGF0aCkgaXNudCBcIi9cIlxuICAgICAgdGhpcy5iYXNlUGF0aCA9IFwiI3t0aGlzLmJhc2VQYXRofS9cIlxuICBfc3RyaXBMYXN0Q2hhcmFjdGVyOiAoc3RyKSAtPlxuICAgIGlmIG5vdCBzdHIgb3IgdHlwZW9mIHN0ciBpc250IFwic3RyaW5nXCJcbiAgICAgIHJldHVybiBcIlwiXG4gICAgbGVuZ3RoID0gc3RyLmxlbmd0aFxuICAgIHN0ci5zdWJzdHJpbmcoMCwgbGVuZ3RoIC0gMSlcbiAgX2ZpcnN0Q2hhcmFjdGVyOiAoc3RyKSAtPlxuICAgIGlmIG5vdCBzdHIgb3IgdHlwZW9mIHN0ciBpc250IFwic3RyaW5nXCJcbiAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoMCwgMSlcbiAgX2xhc3RDaGFyYWN0ZXI6IChzdHIpIC0+XG4gICAgaWYgbm90IHN0ciBvciB0eXBlb2Ygc3RyIGlzbnQgXCJzdHJpbmdcIlxuICAgICAgcmV0dXJuIG51bGxcbiAgICBsZW5ndGggPSBzdHIubGVuZ3RoXG4gICAgc3RyLnN1YnN0cmluZyhsZW5ndGggLSAxLCBsZW5ndGgpXG4gIGRvRGlzY292ZXJ5OiAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG4gICAgaWYgdGhpcy5fY29tcGxldGVcbiAgICAgIGlmIHRoaXMuX2Vycm9yXG4gICAgICAgIGRlZmVycmVkLnJlamVjdCh0aGlzLl9lcnJvcilcbiAgICAgIGVsc2VcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0aGlzKVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2VcbiAgICB0aGlzLl9yZXNvbHZlT25EaXNjb3ZlcnkucHVzaChkZWZlcnJlZClcbiAgICBpZiB0aGlzLl9kaXNjb3ZlcmluZ1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2VcbiAgICB0aGlzLl9kaXNjb3ZlcmluZyA9IHRydWVcbiAgICB0aGlzLl9kb0Rpc2NvdmVyeVJlcXVlc3QoKVxuICAgIGRlZmVycmVkLnByb21pc2VcbiAgX2RvRGlzY292ZXJ5UmVxdWVzdDogLT5cbiAgICBjbGllbnQgPSB0aGlzXG4gICAgdGhpcy5fcmVxdWVzdC5nZXQoXG4gICAgICBcIiN7dGhpcy5lbmRwb2ludH0je3RoaXMuYmFzZVBhdGh9ZGlzY292ZXJ5Lmpzb25cIixcbiAgICAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSAtPlxuICAgICAgY2xpZW50Ll9vbkRpc2NvdmVyeVJlc3VsdChlcnJvciwgcmVzcG9uc2UsIGJvZHkpXG4gICAgKVxuICBfcmVqZWN0V2l0aEVycm9yOiAoZXJyb3IpIC0+XG4gICAgdGhpcy5fZXJyb3IgPSBlcnJvclxuICAgIHRoaXMuX2NvbXBsZXRlID0gdHJ1ZVxuICAgIHRoaXMuX2Rpc2NvdmVyaW5nID0gZmFsc2VcbiAgICBmb3IgaSBpbiB0aGlzLl9yZXNvbHZlT25EaXNjb3ZlcnlcbiAgICAgIGkucmVqZWN0KGVycm9yKVxuICAgIHRoaXMuX3Jlc29sdmVPbkRpc2NvdmVyeSA9IFtdXG4gIF9yZXNvbHZlOiAtPlxuICAgIHRoaXMuX2Vycm9yID0gbnVsbFxuICAgIHRoaXMuX2NvbXBsZXRlID0gdHJ1ZVxuICAgIHRoaXMuX2Rpc2NvdmVyaW5nID0gZmFsc2VcbiAgICBmb3IgaSBpbiB0aGlzLl9yZXNvbHZlT25EaXNjb3ZlcnlcbiAgICAgIGkucmVzb2x2ZSh0aGlzKVxuICAgIHRoaXMuX3Jlc29sdmVPbkRpc2NvdmVyeSA9IFtdXG4gIF9vbkRpc2NvdmVyeVJlc3VsdDogKGVycm9yLCByZXNwb25zZSwgYm9keSkgLT5cbiAgICBpZiBub3QgZXJyb3IgYW5kIHJlc3BvbnNlLnN0YXR1c0NvZGUgaXNudCAyMDBcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBkaXNjb3ZlcnkuanNvblwiKVxuICAgIGlmIG5vdCBlcnJvciBhbmQgbm90IGJvZHlcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFwiRGlzY292ZXJ5IGJvZHkgaXMgZW1wdHlcIilcbiAgICBpZiBlcnJvclxuICAgICAgdGhpcy5fcmVqZWN0V2l0aEVycm9yKGVycm9yKVxuICAgICAgcmV0dXJuXG4gICAganNvbkJvZHkgPSBudWxsXG4gICAgdHJ5XG4gICAgICBqc29uQm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICBjYXRjaCBlcnJcbiAgICAgIHRoaXMuX3JlamVjdFdpdGhFcnJvcihlcnIpXG4gICAgICByZXR1cm5cbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KGpzb25Cb2R5KVxuICAgICAgdGhpcy5fcmVqZWN0V2l0aEVycm9yKG5ldyBFcnJvcihcImRpc2NvdmVyeS5qc29uIGJvZHkgbm90IGFuIG9iamVjdFwiKSlcbiAgICAgIHJldHVyblxuICAgIHRyeVxuICAgICAgdGhpcy5yZXNvdXJjZXMgPSB0aGlzLl9yZXNvbHZlRGlzY292ZXJ5KGpzb25Cb2R5KVxuICAgIGNhdGNoIGVyclxuICAgICAgdGhpcy5fcmVqZWN0V2l0aEVycm9yKGVycilcbiAgICAgIHJldHVyblxuICAgIHRoaXMuX2F0dGFjaFJlc291cmNlcygpXG4gICAgdGhpcy5fcmVzb2x2ZSgpXG4gIG9uRGlzY292ZXJ5OiAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG4gICAgaWYgdGhpcy5fY29tcGxldGVcbiAgICAgIGlmIHRoaXMuX2Vycm9yXG4gICAgICAgIGRlZmVycmVkLnJlamVjdCh0aGlzLl9lcnJvcilcbiAgICAgIGVsc2VcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0aGlzKVxuICAgIGVsc2UgaWYgdGhpcy5fZGlzY292ZXJpbmdcbiAgICAgIHRoaXMuX3Jlc29sdmVPbkRpc2NvdmVyeS5wdXNoKGRlZmVycmVkKVxuICAgIGRlZmVycmVkLnByb21pc2VcbiAgX2F0dGFjaFJlc291cmNlczogLT5cbiAgICBmb3Iga2V5IG9mIHRoaXMucmVzb3VyY2VzXG4gICAgICBpZiBub3QgdGhpcy5yZXNvdXJjZXMuaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICBjb250aW51ZVxuICAgICAgdGhpc1trZXldID0gdGhpcy5yZXNvdXJjZXNba2V5XVxuICBfcmVzb2x2ZURpc2NvdmVyeTogKGRpc2NvdmVyeSkgLT5cbiAgICBpZiBub3QgZGlzY292ZXJ5IG9yIG5vdCBfLmlzUGxhaW5PYmplY3QoZGlzY292ZXJ5KVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkRpc2NvdmVyeSBub3QgaW5zdGFuY2VvZiBhbiBvYmplY3RcIilcbiAgICB0aGlzLl9yZXNvbHZlUmVzb3VyY2VzKGRpc2NvdmVyeS5yZXNvdXJjZXMpXG4gIF9yZXNvbHZlUmVzb3VyY2VzOiAocmVzb3VyY2VzKSAtPlxuICAgIGlmIG5vdCBfLmlzUGxhaW5PYmplY3QocmVzb3VyY2VzKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlJlc291cmNlcyBub3QgYW4gb2JqZWN0XCIpXG4gICAgcmVzdWx0UmVzb3VyY2VzID0ge31cbiAgICBmb3IgcmVzb3VyY2VOYW1lIG9mIHJlc291cmNlc1xuICAgICAgaWYgbm90IHJlc291cmNlcy5oYXNPd25Qcm9wZXJ0eShyZXNvdXJjZU5hbWUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICByZXNvdXJjZSA9IHRoaXMuX3Jlc29sdmVSZXNvdXJjZShyZXNvdXJjZU5hbWUsIHJlc291cmNlc1tyZXNvdXJjZU5hbWVdKVxuICAgICAgaWYgcmVzb3VyY2VcbiAgICAgICAgcmVzdWx0UmVzb3VyY2VzW3Jlc291cmNlTmFtZV0gPSByZXNvdXJjZVxuICAgIHJlc3VsdFJlc291cmNlc1xuICBfcmVzb2x2ZVJlc291cmNlOiAocmVzb3VyY2VOYW1lLCByZXNvdXJjZSkgLT5cbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KHJlc291cmNlKSBvciBub3QgXy5pc1BsYWluT2JqZWN0KHJlc291cmNlLm1ldGhvZHMpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJlc3VsdE1ldGhvZHMgPSB7fVxuICAgIGZvciBtZXRob2ROYW1lIG9mIHJlc291cmNlLm1ldGhvZHNcbiAgICAgIGlmIG5vdCByZXNvdXJjZS5tZXRob2RzLmhhc093blByb3BlcnR5KG1ldGhvZE5hbWUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBtZXRob2QgPSBudWxsXG4gICAgICB0cnlcbiAgICAgICAgbWV0aG9kID0gdGhpcy5fcmVzb2x2ZU1ldGhvZChtZXRob2ROYW1lLCByZXNvdXJjZS5tZXRob2RzW21ldGhvZE5hbWVdKVxuICAgICAgY2F0Y2hcbiAgICAgICAgY29udGludWVcbiAgICAgIGlmIG1ldGhvZFxuICAgICAgICByZXN1bHRNZXRob2RzW21ldGhvZE5hbWVdID0gbWV0aG9kXG4gICAgbmV3IERpc2NvdmVyeVJlc291cmNlKHJlc291cmNlTmFtZSwgcmVzdWx0TWV0aG9kcywgdGhpcylcbiAgX3Jlc29sdmVNZXRob2Q6IChtZXRob2ROYW1lLCBtZXRob2QpIC0+XG4gICAgaWYgbm90IF8uaXNQbGFpbk9iamVjdChtZXRob2QpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIG5ldyBEaXNjb3ZlcnlNZXRob2QoXG4gICAgICBtZXRob2QuaWQsXG4gICAgICBtZXRob2QuZGVzY3JpcHRpb24sXG4gICAgICBtZXRob2QuaHR0cE1ldGhvZCxcbiAgICAgIG1ldGhvZC5wYXRoLFxuICAgICAgbWV0aG9kLnBhcmFtZXRlcnMsXG4gICAgICBtZXRob2QucGFyYW1ldGVyT3JkZXIsXG4gICAgICBtZXRob2QucmVxdWVzdCxcbiAgICAgIG1ldGhvZC5yZXNwb25zZSxcbiAgICAgIHRoaXNcbiAgICApXG4gIF9yZXNvbHZlU2NoZW1hczogKHNjaGVtYXMpIC0+XG4gICAgaWYgbm90IF8uaXNQbGFpbk9iamVjdChzY2hlbWFzKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlNjaGVtYXMgbm90IGFuIG9iamVjdFwiKVxuICAgIHJlc3VsdFNjaGVtYXMgPSB7fVxuICAgIGZvciBzY2hlbWFOYW1lIG9mIHNjaGVtYXNcbiAgICAgIGlmIG5vdCBzY2hlbWFzLmhhc093blByb3BlcnR5KHNjaGVtYU5hbWUpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBzY2hlbWEgPSBudWxsXG4gICAgICB0cnlcbiAgICAgICAgc2NoZW1hID0gdGhpcy5fcmVzb2x2ZVNjaGVtYShzY2hlbWFOYW1lLCBzY2hlbWFzW3NjaGVtYU5hbWVdKVxuICAgICAgY2F0Y2hcbiAgICAgICAgY29udGludWVcbiAgICAgIGlmIHNjaGVtYVxuICAgICAgICByZXN1bHRTY2hlbWFzW3NjaGVtYU5hbWVdID0gc2NoZW1hXG4gICAgdGhpcy5zY2hlbWFzID0gcmVzdWx0U2NoZW1hc1xuICBfcmVzb2x2ZVNjaGVtYTogKHNjaGVtYU5hbWUsIHNjaGVtYSkgLT5cbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KHNjaGVtYSlcbiAgICAgIHJldHVybiBudWxsXG4gICAgbmV3IERpc2NvdmVyeVNjaGVtYShcbiAgICAgIHNjaGVtYS5pZCxcbiAgICAgIHNjaGVtYS50eXBlLFxuICAgICAgc2NoZW1hLnByb3BlcnRpZXMsXG4gICAgICB0aGlzXG4gICAgKVxuICBnZXRTY2hlbWE6IChuYW1lKSAtPlxuICAgIHJldHVybiB0aGlzLnNjaGVtYXNbbmFtZV1cbiAgaGFzU2NoZW1hOiAobmFtZSkgLT5cbiAgICByZXR1cm4gISF0aGlzLnNjaGVtYXNbbmFtZV1cbiAgZ2V0UmVzb3VyY2U6IChuYW1lKSAtPlxuICAgIHJldHVybiB0aGlzLnJlc291cmNlc1tuYW1lXVxuICBoYXNSZXNvdXJjZTogKG5hbWUpIC0+XG4gICAgcmV0dXJuICEhdGhpcy5yZXNvdXJjZXNbbmFtZV1cblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICMjIypcbiAgQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50XG4gIEBwYXJhbSB7c3RyaW5nfSBbYmFzZVBhdGg9Jy92MS1hbHBoYS8nXVxuICBAcGFyYW0ge2Jvb2xlYW59IFtkb0Rpc2NvdmVyeT1mYWxzZV1cbiAgIyMjXG4gIGdldENsaWVudDogKGVuZHBvaW50LCBiYXNlUGF0aCwgZG9EaXNjb3ZlcnkpIC0+XG4gICAgbmV3IERpc2NvdmVyeUNsaWVudChlbmRwb2ludCwgYmFzZVBhdGgsIGRvRGlzY292ZXJ5KVxuIl19
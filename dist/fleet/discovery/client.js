var DiscoveryClient, DiscoveryMethod, DiscoveryResource, Q, request, _;

Q = require("q");

request = require("request");

DiscoveryResource = require("./resource");

DiscoveryMethod = require("./method");

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
    return str.substring(0, length - 2);
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
    var method, methodName, methods;
    if (!_.isPlainObject(resource) || !_.isPlainObject(resource.methods)) {
      return null;
    }
    methods = {};
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
        methods[methodName] = method;
      }
    }
    return new DiscoveryResource(resourceName, methods, this);
  };

  DiscoveryClient.prototype._resolveMethod = function(methodName, method) {
    if (!_.isPlainObject(method)) {
      return null;
    }
    return new DiscoveryMethod(method.id, method.description, method.httpMethod, method.path, method.parameters, method.parameterOrder, method.request, method.response, this);
  };

  DiscoveryClient.prototype._resolveSchemas = function(schemas) {
    var resultSchemas;
    if (!_.isPlainObject(schemas)) {
      throw new TypeError("Schemas not an object");
    }
    resultSchemas = {};
    return resultSchemas;
  };

  DiscoveryClient.prototype.getResource = function(name) {
    return this.resource[name];
  };

  DiscoveryClient.prototype.hasResource = function(name) {
    if (!this._complete) {
      return false;
    }
    return !!this.resource[name];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS9jbGllbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsa0VBQUE7O0FBQUEsQ0FBQSxHQUFvQixPQUFBLENBQVEsR0FBUixDQUFwQixDQUFBOztBQUFBLE9BQ0EsR0FBb0IsT0FBQSxDQUFRLFNBQVIsQ0FEcEIsQ0FBQTs7QUFBQSxpQkFFQSxHQUFvQixPQUFBLENBQVEsWUFBUixDQUZwQixDQUFBOztBQUFBLGVBR0EsR0FBb0IsT0FBQSxDQUFRLFVBQVIsQ0FIcEIsQ0FBQTs7QUFBQSxDQUlBLEdBQW9CLE9BQUEsQ0FBUSxRQUFSLENBSnBCLENBQUE7O0FBQUE7QUFRRSw0QkFBQSxJQUFBLEdBQU0sRUFBTixDQUFBOztBQUFBLDRCQUNBLGdCQUFBLEdBQWtCLEVBRGxCLENBQUE7O0FBQUEsNEJBRUEsRUFBQSxHQUFJLEVBRkosQ0FBQTs7QUFBQSw0QkFHQSxJQUFBLEdBQU0sRUFITixDQUFBOztBQUFBLDRCQUlBLE9BQUEsR0FBUyxFQUpULENBQUE7O0FBQUEsNEJBS0EsS0FBQSxHQUFPLEVBTFAsQ0FBQTs7QUFBQSw0QkFNQSxXQUFBLEdBQWEsRUFOYixDQUFBOztBQUFBLDRCQU9BLFlBQUEsR0FBYyxFQVBkLENBQUE7O0FBQUEsNEJBUUEsUUFBQSxHQUFVLEVBUlYsQ0FBQTs7QUFBQSw0QkFTQSxPQUFBLEdBQVMsRUFUVCxDQUFBOztBQUFBLDRCQVVBLFFBQUEsR0FBVSxFQVZWLENBQUE7O0FBQUEsNEJBV0EsT0FBQSxHQUFTLEVBWFQsQ0FBQTs7QUFBQSw0QkFZQSxXQUFBLEdBQWEsRUFaYixDQUFBOztBQUFBLDRCQWFBLFNBQUEsR0FBVyxFQWJYLENBQUE7O0FBQUEsNEJBY0EsUUFBQSxHQUFVLEVBZFYsQ0FBQTs7QUFBQSw0QkFlQSxTQUFBLEdBQVcsRUFmWCxDQUFBOztBQUFBLDRCQWtCQSxTQUFBLEdBQVcsS0FsQlgsQ0FBQTs7QUFBQSw0QkFtQkEsTUFBQSxHQUFRLElBbkJSLENBQUE7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TUE2TU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQTtBQUFBOzs7O0tBQUE7QUFBQSxFQUtBLFNBQUEsRUFBVyxTQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXFCLFdBQXJCLEdBQUE7V0FDTCxJQUFBLGVBQUEsQ0FBZ0IsUUFBaEIsRUFBMEIsUUFBMUIsRUFBb0MsV0FBcEMsRUFESztFQUFBLENBTFg7Q0E5TUYsQ0FBQSIsImZpbGUiOiJmbGVldC9kaXNjb3ZlcnkvY2xpZW50LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiUSAgICAgICAgICAgICAgICAgPSByZXF1aXJlKFwicVwiKVxucmVxdWVzdCAgICAgICAgICAgPSByZXF1aXJlKFwicmVxdWVzdFwiKVxuRGlzY292ZXJ5UmVzb3VyY2UgPSByZXF1aXJlKFwiLi9yZXNvdXJjZVwiKVxuRGlzY292ZXJ5TWV0aG9kICAgPSByZXF1aXJlKFwiLi9tZXRob2RcIilcbl8gICAgICAgICAgICAgICAgID0gcmVxdWlyZShcImxvZGFzaFwiKVxuXG5jbGFzcyBEaXNjb3ZlcnlDbGllbnRcbiAgIyBTVEFSVCBWYWx1ZXMgZnJvbSBkaXNjb3ZlcnkuanNvblxuICBraW5kOiBcIlwiXG4gIGRpc2NvdmVyeVZlcnNpb246IFwiXCJcbiAgaWQ6IFwiXCJcbiAgbmFtZTogXCJcIlxuICB2ZXJzaW9uOiBcIlwiXG4gIHRpdGxlOiBcIlwiXG4gIGRlc2NyaXB0aW9uOiBcIlwiXG4gIGRvY3VtZW50TGluazogXCJcIlxuICBwcm90b2NvbDogXCJcIlxuICBiYXNlVXJsOiBcIlwiXG4gIGJhc2VQYXRoOiBcIlwiXG4gIHJvb3RVcmw6IFwiXCJcbiAgc2VydmljZVBhdGg6IFwiXCJcbiAgYmF0Y2hQYXRoOiBcIlwiXG4gIGVuZHBvaW50OiBcIlwiXG4gIHJlc291cmNlczoge31cbiAgIyBFTkQgVmFsdWVzIGZyb20gZGlzY292ZXIuanNvblxuICAjIFNUQVJUIFwiUHJpdmF0ZVwiIHZhcmlhYmxlc1xuICBfY29tcGxldGU6IGZhbHNlXG4gIF9lcnJvcjogbnVsbFxuICBfZGlzY292ZXJpbmc6IGZhbHNlXG4gIF9yZXNvbHZlT25EaXNjb3Zlcnk6IFtdXG4gIF9yZXF1ZXN0OiByZXF1ZXN0XG4gICMgRU5EIFwiUHJpdmF0ZVwiIHZhcmlhYmxlc1xuICAjIyMqXG4gIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludFxuICBAcGFyYW0ge3N0cmluZ30gW2Jhc2VQYXRoPScvdjEtYWxwaGEvJ11cbiAgQHBhcmFtIHtib29sZWFufSBbZG9EaXNjb3Zlcnk9ZmFsc2VdXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKGVuZHBvaW50LCBiYXNlUGF0aCwgZG9EaXNjb3ZlcnkpIC0+XG4gICAgdGhpcy5lbmRwb2ludCA9IGVuZHBvaW50XG4gICAgdGhpcy5iYXNlUGF0aCA9IGJhc2VQYXRoXG4gICAgdGhpcy5fdmFsaWRhdGVFbmRwb2ludCgpXG4gICAgaWYgZG9EaXNjb3ZlcnlcbiAgICAgIHRoaXMuZG9EaXNjb3ZlcnkoKVxuICBfdmFsaWRhdGVFbmRwb2ludDogLT5cbiAgICBpZiBub3QgdGhpcy5lbmRwb2ludFxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW5kcG9pbnQgaXMgcmVxdWlyZWRcIilcbiAgICBpZiB0eXBlb2YgdGhpcy5lbmRwb2ludCBpc250IFwic3RyaW5nXCJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFbmRwb2ludCBpcyBleHBlY3RlZCB0byBiZSBhIHN0cmluZ1wiKVxuICAgIGlmIHRoaXMuYmFzZVBhdGggaXMgbnVsbCBvciB0aGlzLmJhc2VQYXRoIGlzIHVuZGVmaW5lZFxuICAgICAgdGhpcy5iYXNlUGF0aCA9IFwiL3YxLWFscGhhL1wiXG4gICAgZWxzZSBpZiB0eXBlb2YgdGhpcy5iYXNlUGF0aCBpc250IFwic3RyaW5nXCJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJCYXNlIHBhdGggaXMgZXhwZWN0ZWQgdG8gYmUgYSBzdHJpbmdcIilcbiAgICBpZiB0aGlzLl9sYXN0Q2hhcmFjdGVyKHRoaXMuZW5kcG9pbnQpIGlzIFwiL1wiXG4gICAgICB0aGlzLmVuZHBvaW50ID0gdGhpcy5fc3RyaXBMYXN0Q2hhcmFjdGVyKHRoaXMuZW5kcG9pbnQpXG4gICAgIyBFbnN1cmUgYmFzZVBhdGggaGFzIGF0IGxlYXN0IFwiL1wiXG4gICAgIyBvciBpcyBcIi8je3BhdGh9L1wiXG4gICAgaWYgdGhpcy5fZmlyc3RDaGFyYWN0ZXIodGhpcy5iYXNlUGF0aCkgaXNudCBcIi9cIlxuICAgICAgdGhpcy5iYXNlUGF0aCA9IFwiLyN7dGhpcy5iYXNlUGF0aH1cIlxuICAgIGlmIHRoaXMuX2xhc3RDaGFyYWN0ZXIodGhpcy5iYXNlUGF0aCkgaXNudCBcIi9cIlxuICAgICAgdGhpcy5iYXNlUGF0aCA9IFwiI3t0aGlzLmJhc2VQYXRofS9cIlxuICBfc3RyaXBMYXN0Q2hhcmFjdGVyOiAoc3RyKSAtPlxuICAgIGlmIG5vdCBzdHIgb3IgdHlwZW9mIHN0ciBpc250IFwic3RyaW5nXCJcbiAgICAgIHJldHVybiBcIlwiXG4gICAgbGVuZ3RoID0gc3RyLmxlbmd0aFxuICAgIHN0ci5zdWJzdHJpbmcoMCwgbGVuZ3RoIC0gMilcbiAgX2ZpcnN0Q2hhcmFjdGVyOiAoc3RyKSAtPlxuICAgIGlmIG5vdCBzdHIgb3IgdHlwZW9mIHN0ciBpc250IFwic3RyaW5nXCJcbiAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoMCwgMSlcbiAgX2xhc3RDaGFyYWN0ZXI6IChzdHIpIC0+XG4gICAgaWYgbm90IHN0ciBvciB0eXBlb2Ygc3RyIGlzbnQgXCJzdHJpbmdcIlxuICAgICAgcmV0dXJuIG51bGxcbiAgICBsZW5ndGggPSBzdHIubGVuZ3RoXG4gICAgc3RyLnN1YnN0cmluZyhsZW5ndGggLSAxLCBsZW5ndGgpXG4gIGRvRGlzY292ZXJ5OiAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG4gICAgaWYgdGhpcy5fY29tcGxldGVcbiAgICAgIGlmIHRoaXMuX2Vycm9yXG4gICAgICAgIGRlZmVycmVkLnJlamVjdCh0aGlzLl9lcnJvcilcbiAgICAgIGVsc2VcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0aGlzKVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2VcbiAgICB0aGlzLl9yZXNvbHZlT25EaXNjb3ZlcnkucHVzaChkZWZlcnJlZClcbiAgICBpZiB0aGlzLl9kaXNjb3ZlcmluZ1xuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2VcbiAgICB0aGlzLl9kaXNjb3ZlcmluZyA9IHRydWVcbiAgICB0aGlzLl9kb0Rpc2NvdmVyeVJlcXVlc3QoKVxuICAgIGRlZmVycmVkLnByb21pc2VcbiAgX2RvRGlzY292ZXJ5UmVxdWVzdDogLT5cbiAgICBjbGllbnQgPSB0aGlzXG4gICAgdGhpcy5fcmVxdWVzdC5nZXQoXG4gICAgICBcIiN7dGhpcy5lbmRwb2ludH0je3RoaXMuYmFzZVBhdGh9ZGlzY292ZXJ5Lmpzb25cIixcbiAgICAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSAtPlxuICAgICAgY2xpZW50Ll9vbkRpc2NvdmVyeVJlc3VsdChlcnJvciwgcmVzcG9uc2UsIGJvZHkpXG4gICAgKVxuICBfcmVqZWN0V2l0aEVycm9yOiAoZXJyb3IpIC0+XG4gICAgdGhpcy5fZXJyb3IgPSBlcnJvclxuICAgIHRoaXMuX2NvbXBsZXRlID0gdHJ1ZVxuICAgIHRoaXMuX2Rpc2NvdmVyaW5nID0gZmFsc2VcbiAgICBmb3IgaSBpbiB0aGlzLl9yZXNvbHZlT25EaXNjb3ZlcnlcbiAgICAgIGkucmVqZWN0KGVycm9yKVxuICAgIHRoaXMuX3Jlc29sdmVPbkRpc2NvdmVyeSA9IFtdXG4gIF9yZXNvbHZlOiAtPlxuICAgIHRoaXMuX2Vycm9yID0gbnVsbFxuICAgIHRoaXMuX2NvbXBsZXRlID0gdHJ1ZVxuICAgIHRoaXMuX2Rpc2NvdmVyaW5nID0gZmFsc2VcbiAgICBmb3IgaSBpbiB0aGlzLl9yZXNvbHZlT25EaXNjb3ZlcnlcbiAgICAgIGkucmVzb2x2ZSh0aGlzKVxuICAgIHRoaXMuX3Jlc29sdmVPbkRpc2NvdmVyeSA9IFtdXG4gIF9vbkRpc2NvdmVyeVJlc3VsdDogKGVycm9yLCByZXNwb25zZSwgYm9keSkgLT5cbiAgICBpZiBub3QgZXJyb3IgYW5kIHJlc3BvbnNlLnN0YXR1c0NvZGUgaXNudCAyMDBcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFwiRmFpbGVkIHRvIGdldCBkaXNjb3ZlcnkuanNvblwiKVxuICAgIGlmIG5vdCBlcnJvciBhbmQgbm90IGJvZHlcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFwiRGlzY292ZXJ5IGJvZHkgaXMgZW1wdHlcIilcbiAgICBpZiBlcnJvclxuICAgICAgdGhpcy5fcmVqZWN0V2l0aEVycm9yKGVycm9yKVxuICAgICAgcmV0dXJuXG4gICAganNvbkJvZHkgPSBudWxsXG4gICAgdHJ5XG4gICAgICBqc29uQm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICBjYXRjaCBlcnJcbiAgICAgIHRoaXMuX3JlamVjdFdpdGhFcnJvcihlcnIpXG4gICAgICByZXR1cm5cbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KGpzb25Cb2R5KVxuICAgICAgdGhpcy5fcmVqZWN0V2l0aEVycm9yKG5ldyBFcnJvcihcImRpc2NvdmVyeS5qc29uIGJvZHkgbm90IGFuIG9iamVjdFwiKSlcbiAgICAgIHJldHVyblxuICAgIHRyeVxuICAgICAgdGhpcy5yZXNvdXJjZXMgPSB0aGlzLl9yZXNvbHZlRGlzY292ZXJ5KGpzb25Cb2R5KVxuICAgIGNhdGNoIGVyclxuICAgICAgdGhpcy5fcmVqZWN0V2l0aEVycm9yKGVycilcbiAgICAgIHJldHVyblxuICAgIHRoaXMuX3Jlc29sdmUoKVxuICBvbkRpc2NvdmVyeTogLT5cbiAgICBkZWZlcnJlZCA9IFEuZGVmZXIoKVxuICAgIGlmIHRoaXMuX2NvbXBsZXRlXG4gICAgICBpZiB0aGlzLl9lcnJvclxuICAgICAgICBkZWZlcnJlZC5yZWplY3QodGhpcy5fZXJyb3IpXG4gICAgICBlbHNlXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUodGhpcylcbiAgICBlbHNlIGlmIHRoaXMuX2Rpc2NvdmVyaW5nXG4gICAgICB0aGlzLl9yZXNvbHZlT25EaXNjb3ZlcnkucHVzaChkZWZlcnJlZClcbiAgICBkZWZlcnJlZC5wcm9taXNlXG4gIF9hdHRhY2hSZXNvdXJjZXM6IC0+XG4gICAgZm9yIGtleSBvZiB0aGlzLnJlc291cmNlc1xuICAgICAgaWYgbm90IHRoaXMucmVzb3VyY2VzLmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgY29udGludWVcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMucmVzb3VyY2VzW2tleV1cbiAgX3Jlc29sdmVEaXNjb3Zlcnk6IChkaXNjb3ZlcnkpIC0+XG4gICAgaWYgbm90IGRpc2NvdmVyeSBvciBub3QgXy5pc1BsYWluT2JqZWN0KGRpc2NvdmVyeSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJEaXNjb3Zlcnkgbm90IGluc3RhbmNlb2YgYW4gb2JqZWN0XCIpXG4gICAgdGhpcy5fcmVzb2x2ZVJlc291cmNlcyhkaXNjb3ZlcnkucmVzb3VyY2VzKVxuICBfcmVzb2x2ZVJlc291cmNlczogKHJlc291cmNlcykgLT5cbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KHJlc291cmNlcylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJSZXNvdXJjZXMgbm90IGFuIG9iamVjdFwiKVxuICAgIHJlc3VsdFJlc291cmNlcyA9IHt9XG4gICAgZm9yIHJlc291cmNlTmFtZSBvZiByZXNvdXJjZXNcbiAgICAgIGlmIG5vdCByZXNvdXJjZXMuaGFzT3duUHJvcGVydHkocmVzb3VyY2VOYW1lKVxuICAgICAgICBjb250aW51ZVxuICAgICAgcmVzb3VyY2UgPSB0aGlzLl9yZXNvbHZlUmVzb3VyY2UocmVzb3VyY2VOYW1lLCByZXNvdXJjZXNbcmVzb3VyY2VOYW1lXSlcbiAgICAgIGlmIHJlc291cmNlXG4gICAgICAgIHJlc3VsdFJlc291cmNlc1tyZXNvdXJjZU5hbWVdID0gcmVzb3VyY2VcbiAgICByZXN1bHRSZXNvdXJjZXNcbiAgX3Jlc29sdmVSZXNvdXJjZTogKHJlc291cmNlTmFtZSwgcmVzb3VyY2UpIC0+XG4gICAgaWYgbm90IF8uaXNQbGFpbk9iamVjdChyZXNvdXJjZSkgb3Igbm90IF8uaXNQbGFpbk9iamVjdChyZXNvdXJjZS5tZXRob2RzKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICBtZXRob2RzID0ge31cbiAgICBmb3IgbWV0aG9kTmFtZSBvZiByZXNvdXJjZS5tZXRob2RzXG4gICAgICBpZiBub3QgcmVzb3VyY2UubWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShtZXRob2ROYW1lKVxuICAgICAgICBjb250aW51ZVxuICAgICAgbWV0aG9kID0gbnVsbFxuICAgICAgdHJ5XG4gICAgICAgIG1ldGhvZCA9IHRoaXMuX3Jlc29sdmVNZXRob2QobWV0aG9kTmFtZSwgcmVzb3VyY2UubWV0aG9kc1ttZXRob2ROYW1lXSlcbiAgICAgIGNhdGNoXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICBpZiBtZXRob2RcbiAgICAgICAgbWV0aG9kc1ttZXRob2ROYW1lXSA9IG1ldGhvZFxuICAgIG5ldyBEaXNjb3ZlcnlSZXNvdXJjZShyZXNvdXJjZU5hbWUsIG1ldGhvZHMsIHRoaXMpXG4gIF9yZXNvbHZlTWV0aG9kOiAobWV0aG9kTmFtZSwgbWV0aG9kKSAtPlxuICAgIGlmIG5vdCBfLmlzUGxhaW5PYmplY3QobWV0aG9kKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICBuZXcgRGlzY292ZXJ5TWV0aG9kKFxuICAgICAgbWV0aG9kLmlkLFxuICAgICAgbWV0aG9kLmRlc2NyaXB0aW9uLFxuICAgICAgbWV0aG9kLmh0dHBNZXRob2QsXG4gICAgICBtZXRob2QucGF0aCxcbiAgICAgIG1ldGhvZC5wYXJhbWV0ZXJzLFxuICAgICAgbWV0aG9kLnBhcmFtZXRlck9yZGVyLFxuICAgICAgbWV0aG9kLnJlcXVlc3QsXG4gICAgICBtZXRob2QucmVzcG9uc2UsXG4gICAgICB0aGlzXG4gICAgKVxuICBfcmVzb2x2ZVNjaGVtYXM6IChzY2hlbWFzKSAtPlxuICAgIGlmIG5vdCBfLmlzUGxhaW5PYmplY3Qoc2NoZW1hcylcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTY2hlbWFzIG5vdCBhbiBvYmplY3RcIilcbiAgICByZXN1bHRTY2hlbWFzID0ge31cblxuICAgIHJlc3VsdFNjaGVtYXNcbiAgZ2V0UmVzb3VyY2U6IChuYW1lKSAtPlxuICAgIHJldHVybiB0aGlzLnJlc291cmNlW25hbWVdXG4gIGhhc1Jlc291cmNlOiAobmFtZSkgLT5cbiAgICBpZiBub3QgdGhpcy5fY29tcGxldGVcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiAhIXRoaXMucmVzb3VyY2VbbmFtZV1cblxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICMjIypcbiAgQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50XG4gIEBwYXJhbSB7c3RyaW5nfSBbYmFzZVBhdGg9Jy92MS1hbHBoYS8nXVxuICBAcGFyYW0ge2Jvb2xlYW59IFtkb0Rpc2NvdmVyeT1mYWxzZV1cbiAgIyMjXG4gIGdldENsaWVudDogKGVuZHBvaW50LCBiYXNlUGF0aCwgZG9EaXNjb3ZlcnkpIC0+XG4gICAgbmV3IERpc2NvdmVyeUNsaWVudChlbmRwb2ludCwgYmFzZVBhdGgsIGRvRGlzY292ZXJ5KVxuIl19
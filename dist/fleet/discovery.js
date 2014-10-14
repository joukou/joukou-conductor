var DiscoveryClient, DiscoveryMethod, DiscoveryResource, Q, request;

Q = require("q");

request = require("request");

DiscoveryMethod = (function() {
  function DiscoveryMethod(id, description, httpMethod, path, parameters, parameterOrder, response) {}

  return DiscoveryMethod;

})();

DiscoveryResource = (function() {

  /**
  @param {string} name
  @param {Array.<DiscoveryMethod>} methods
   */
  function DiscoveryResource(name, methods) {}

  return DiscoveryResource;

})();

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

  DiscoveryClient.prototype.resources = [];

  DiscoveryClient.prototype.complete = false;

  DiscoveryClient.prototype.error = null;

  DiscoveryClient.prototype.discovering = false;

  DiscoveryClient.prototype.resolveOnDiscovery = [];


  /**
  @param {string} endpoint
   */

  function DiscoveryClient(endpoint, basePath) {
    self.endpoint = endpoint;
    if (!endpoint) {
      throw new Error("Endpoint is required");
    }
    self.basePath = basePath;
    if (self.basePath === null) {
      self.basePath = "/v1-alpha/";
    }
  }

  DiscoveryClient.prototype.doDiscovery = function() {
    var client, deferred;
    deferred = Q.defer();
    if (self.complete) {
      deferred.resolve(self);
      return deferred.promise;
    }
    self.resolveOnDiscovery.push(deferred);
    if (self.discovering) {
      return deferred.promise;
    }
    self.discovering = true;
    client = self;
    request.get("" + self.endpoint + self.basePath + "discovery.json", function(error, response, body) {
      var err, i, jsonBody, rejectWithError, _i, _len, _ref;
      rejectWithError = function(rejectError) {
        var i, _i, _len, _ref;
        client.error = rejectError;
        client.complete = true;
        client.discovering = false;
        _ref = client.resolveOnDiscovery;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          i.reject(rejectError);
        }
        return client.resolveOnDiscovery = [];
      };
      if (response.statusCode !== 200) {
        error = new Error("Failed to get discovery.json");
      }
      if (error) {
        rejectWithError(error);
        return;
      }
      jsonBody = null;
      try {
        jsonBody = JSON.parse(body);
      } catch (_error) {
        rejectWithError(error);
        return;
      }
      if (!jsonBody) {
        rejectWithError(new Error("discovery.json body empty"));
        return;
      }
      try {
        client.resolveDiscovery(jsonBody);
      } catch (_error) {
        err = _error;
        rejectWithError(err);
        return;
      }
      client.error = null;
      client.complete = true;
      client.discovering = false;
      _ref = client.resolveOnDiscovery;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        i.resolve(client);
      }
      return client.resolveOnDiscovery = [];
    });
    return deferred.promise;
  };

  DiscoveryClient.prototype.onDiscovery = function() {
    var deferred;
    deferred = Q.defer();
    if (self.complete) {
      if (self.error) {
        deferred.reject(self.error);
      } else {
        deferred.resolve(self);
      }
    } else if (self.discovering) {
      self.resolveOnDiscovery.push(deferred);
    }
    return deferred.promise;
  };

  DiscoveryClient.prototype.resolveDiscovery = function(discovery) {};

  return DiscoveryClient;

})();

module.exports = {

  /**
  @param {string} endpoint
   */
  getClient: function(endpoint) {
    return new DiscoveryClient(endpoint);
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwrREFBQTs7QUFBQSxDQUFBLEdBQVUsT0FBQSxDQUFRLEdBQVIsQ0FBVixDQUFBOztBQUFBLE9BQ0EsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUE7QUFJZSxFQUFBLHlCQUFDLEVBQUQsRUFDQyxXQURELEVBRUMsVUFGRCxFQUdDLElBSEQsRUFJQyxVQUpELEVBS0MsY0FMRCxFQU1DLFFBTkQsR0FBQSxDQUFiOzt5QkFBQTs7SUFKRixDQUFBOztBQUFBO0FBY0U7QUFBQTs7O0tBQUE7QUFJYSxFQUFBLDJCQUFDLElBQUQsRUFBTyxPQUFQLEdBQUEsQ0FKYjs7MkJBQUE7O0lBZEYsQ0FBQTs7QUFBQTtBQXNCRSw0QkFBQSxJQUFBLEdBQU0sRUFBTixDQUFBOztBQUFBLDRCQUNBLGdCQUFBLEdBQWtCLEVBRGxCLENBQUE7O0FBQUEsNEJBRUEsRUFBQSxHQUFJLEVBRkosQ0FBQTs7QUFBQSw0QkFHQSxJQUFBLEdBQU0sRUFITixDQUFBOztBQUFBLDRCQUlBLE9BQUEsR0FBUyxFQUpULENBQUE7O0FBQUEsNEJBS0EsS0FBQSxHQUFPLEVBTFAsQ0FBQTs7QUFBQSw0QkFNQSxXQUFBLEdBQWEsRUFOYixDQUFBOztBQUFBLDRCQU9BLFlBQUEsR0FBYyxFQVBkLENBQUE7O0FBQUEsNEJBUUEsUUFBQSxHQUFVLEVBUlYsQ0FBQTs7QUFBQSw0QkFTQSxPQUFBLEdBQVMsRUFUVCxDQUFBOztBQUFBLDRCQVVBLFFBQUEsR0FBVSxFQVZWLENBQUE7O0FBQUEsNEJBV0EsT0FBQSxHQUFTLEVBWFQsQ0FBQTs7QUFBQSw0QkFZQSxXQUFBLEdBQWEsRUFaYixDQUFBOztBQUFBLDRCQWFBLFNBQUEsR0FBVyxFQWJYLENBQUE7O0FBQUEsNEJBY0EsUUFBQSxHQUFVLEVBZFYsQ0FBQTs7QUFBQSw0QkFlQSxTQUFBLEdBQVcsRUFmWCxDQUFBOztBQUFBLDRCQWlC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QTtBQUFBOztLQUFBO0FBQUEsRUFHQSxTQUFBLEVBQVcsU0FBQyxRQUFELEdBQUE7V0FDTCxJQUFBLGVBQUEsQ0FBZ0IsUUFBaEIsRUFESztFQUFBLENBSFg7Q0FwSEYsQ0FBQSIsImZpbGUiOiJmbGVldC9kaXNjb3ZlcnkuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJRICAgICAgID0gcmVxdWlyZShcInFcIilcbnJlcXVlc3QgPSByZXF1aXJlKFwicmVxdWVzdFwiKVxuXG5jbGFzcyBEaXNjb3ZlcnlNZXRob2RcbiAgY29uc3RydWN0b3I6IChpZCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgICAgICBodHRwTWV0aG9kLFxuICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJPcmRlcixcbiAgICAgICAgICAgICAgICByZXNwb25zZSkgLT5cblxuXG5jbGFzcyBEaXNjb3ZlcnlSZXNvdXJjZVxuICAjIyMqXG4gIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gIEBwYXJhbSB7QXJyYXkuPERpc2NvdmVyeU1ldGhvZD59IG1ldGhvZHNcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAobmFtZSwgbWV0aG9kcykgLT5cblxuY2xhc3MgRGlzY292ZXJ5Q2xpZW50XG4gICMgU1RBUlQgVmFsdWVzIGZyb20gZGlzY292ZXJ5Lmpzb25cbiAga2luZDogXCJcIlxuICBkaXNjb3ZlcnlWZXJzaW9uOiBcIlwiXG4gIGlkOiBcIlwiXG4gIG5hbWU6IFwiXCJcbiAgdmVyc2lvbjogXCJcIlxuICB0aXRsZTogXCJcIlxuICBkZXNjcmlwdGlvbjogXCJcIlxuICBkb2N1bWVudExpbms6IFwiXCJcbiAgcHJvdG9jb2w6IFwiXCJcbiAgYmFzZVVybDogXCJcIlxuICBiYXNlUGF0aDogXCJcIlxuICByb290VXJsOiBcIlwiXG4gIHNlcnZpY2VQYXRoOiBcIlwiXG4gIGJhdGNoUGF0aDogXCJcIlxuICBlbmRwb2ludDogXCJcIlxuICByZXNvdXJjZXM6IFtdXG4gICMgRU5EIFZhbHVlcyBmcm9tIGRpc2NvdmVyLmpzb25cbiAgY29tcGxldGU6IGZhbHNlXG4gIGVycm9yOiBudWxsXG4gIGRpc2NvdmVyaW5nOiBmYWxzZVxuICByZXNvbHZlT25EaXNjb3Zlcnk6IFtdXG5cbiAgIyMjKlxuICBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnRcbiAgIyMjXG4gIGNvbnN0cnVjdG9yOiAoZW5kcG9pbnQsIGJhc2VQYXRoKSAtPlxuICAgIHNlbGYuZW5kcG9pbnQgPSBlbmRwb2ludFxuICAgIGlmIG5vdCBlbmRwb2ludFxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW5kcG9pbnQgaXMgcmVxdWlyZWRcIilcbiAgICBzZWxmLmJhc2VQYXRoID0gYmFzZVBhdGhcbiAgICBpZiBzZWxmLmJhc2VQYXRoIGlzIG51bGxcbiAgICAgIHNlbGYuYmFzZVBhdGggPSBcIi92MS1hbHBoYS9cIlxuICBkb0Rpc2NvdmVyeTogLT5cbiAgICBkZWZlcnJlZCA9IFEuZGVmZXIoKVxuICAgIGlmIHNlbGYuY29tcGxldGVcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoc2VsZilcbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlXG4gICAgc2VsZi5yZXNvbHZlT25EaXNjb3ZlcnkucHVzaChkZWZlcnJlZClcbiAgICBpZiBzZWxmLmRpc2NvdmVyaW5nXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxuICAgIHNlbGYuZGlzY292ZXJpbmcgPSB0cnVlXG4gICAgY2xpZW50ID0gc2VsZlxuICAgIHJlcXVlc3QuZ2V0KFxuICAgICAgXCIje3NlbGYuZW5kcG9pbnR9I3tzZWxmLmJhc2VQYXRofWRpc2NvdmVyeS5qc29uXCIsXG4gICAgICAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSAtPlxuICAgICAgICByZWplY3RXaXRoRXJyb3IgPSAocmVqZWN0RXJyb3IpIC0+XG4gICAgICAgICAgY2xpZW50LmVycm9yID0gcmVqZWN0RXJyb3JcbiAgICAgICAgICBjbGllbnQuY29tcGxldGUgPSB0cnVlXG4gICAgICAgICAgY2xpZW50LmRpc2NvdmVyaW5nID0gZmFsc2VcbiAgICAgICAgICBmb3IgaSBpbiBjbGllbnQucmVzb2x2ZU9uRGlzY292ZXJ5XG4gICAgICAgICAgICBpLnJlamVjdChyZWplY3RFcnJvcilcbiAgICAgICAgICBjbGllbnQucmVzb2x2ZU9uRGlzY292ZXJ5ID0gW11cblxuICAgICAgICBpZiByZXNwb25zZS5zdGF0dXNDb2RlIGlzbnQgMjAwXG4gICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IGRpc2NvdmVyeS5qc29uXCIpXG4gICAgICAgIGlmIGVycm9yXG4gICAgICAgICAgcmVqZWN0V2l0aEVycm9yKGVycm9yKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICBqc29uQm9keSA9IG51bGxcbiAgICAgICAgdHJ5XG4gICAgICAgICAganNvbkJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgIGNhdGNoXG4gICAgICAgICAgcmVqZWN0V2l0aEVycm9yKGVycm9yKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICBpZiBub3QganNvbkJvZHlcbiAgICAgICAgICByZWplY3RXaXRoRXJyb3IobmV3IEVycm9yKFwiZGlzY292ZXJ5Lmpzb24gYm9keSBlbXB0eVwiKSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgdHJ5XG4gICAgICAgICAgY2xpZW50LnJlc29sdmVEaXNjb3ZlcnkoanNvbkJvZHkpXG4gICAgICAgIGNhdGNoIGVyclxuICAgICAgICAgIHJlamVjdFdpdGhFcnJvcihlcnIpXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGNsaWVudC5lcnJvciA9IG51bGxcbiAgICAgICAgY2xpZW50LmNvbXBsZXRlID0gdHJ1ZVxuICAgICAgICBjbGllbnQuZGlzY292ZXJpbmcgPSBmYWxzZVxuICAgICAgICBmb3IgaSBpbiBjbGllbnQucmVzb2x2ZU9uRGlzY292ZXJ5XG4gICAgICAgICAgaS5yZXNvbHZlKGNsaWVudClcbiAgICAgICAgY2xpZW50LnJlc29sdmVPbkRpc2NvdmVyeSA9IFtdXG4gICAgKVxuICAgIGRlZmVycmVkLnByb21pc2U7XG4gIG9uRGlzY292ZXJ5OiAtPlxuICAgIGRlZmVycmVkID0gUS5kZWZlcigpXG4gICAgaWYgc2VsZi5jb21wbGV0ZVxuICAgICAgaWYgc2VsZi5lcnJvclxuICAgICAgICBkZWZlcnJlZC5yZWplY3Qoc2VsZi5lcnJvcilcbiAgICAgIGVsc2VcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShzZWxmKVxuICAgIGVsc2UgaWYgc2VsZi5kaXNjb3ZlcmluZ1xuICAgICAgc2VsZi5yZXNvbHZlT25EaXNjb3ZlcnkucHVzaChkZWZlcnJlZClcbiAgICBkZWZlcnJlZC5wcm9taXNlXG4gIHJlc29sdmVEaXNjb3Zlcnk6IChkaXNjb3ZlcnkpIC0+XG5cblxubW9kdWxlLmV4cG9ydHMgPVxuICAjIyMqXG4gIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludFxuICAjIyNcbiAgZ2V0Q2xpZW50OiAoZW5kcG9pbnQpIC0+XG4gICAgbmV3IERpc2NvdmVyeUNsaWVudChlbmRwb2ludClcbiJdfQ==
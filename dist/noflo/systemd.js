var SystemDUnitFile, createFile, createOptions, findPorts, _;

SystemDUnitFile = require("../systemd/unit-file");

_ = require("lodash");

({
  createFromSchema: function(input, machineID, joukouMessageQueAddress, joukouApiAddress) {
    var connections, name, processes;
    if (!_.isPlainObject(input)) {
      throw new TypeError("input is not an object");
    }
    if (!machineID) {
      throw new Error("machineID is required");
    }
    if (typeof machineID !== "string") {
      throw new TypeError("machineID is not a string");
    }
    if (!_.isPlainObject(input.properties)) {
      throw new TypeError("input.properties is not an object");
    }
    if (!_.isPlainObject(input.processes)) {
      throw new TypeError("input.processes is not an object");
    }
    if (!_.isArray(input.connections)) {
      throw new TypeError("input.connections is not an array");
    }
    name = input.properties.name;
    if (!name) {
      throw new Error("input.properties.name is required");
    }
    connections = _.cloneDeep(input.connections);
    processes = _.cloneDeep(input.processes);
    return createOptions(name, processes, connections);
  }
});

createOptions = function(name, processes, connections, machineID, joukouMessageQueAddress, joukouApiAddress) {
  var file, options, process, processKey, unit, _i, _len, _ref;
  options = [];

  /*
  use format
  [
    {
      unitName: "name"
      options: [SystemDUnitFile].options
      machineID: machineID
    }
  ]
   */
  _ref = input.processes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    processKey = _ref[_i];
    if (!input.hasOwnProperty(processKey)) {
      continue;
    }
    process = input.processes[processKey];
    unit = {
      process: process,
      processKey: processKey,
      machineID: machineID,
      dockerContainer: process.component,
      ports: this.findPorts(connections, processKey)
    };
    file = createFile(unit, joukouMessageQueAddress, joukouApiAddress);
    options.push({
      unitName: processKey,
      options: file.options,
      machineID: machineID
    });
  }
  return options;
};

createFile = function(unit, joukouMessageQueAddress, joukouApiAddress) {
  var file;
  file = new SystemDUnitFile();
  file.service.addEnvironment("JOUKOU_AMQP_ADDR", joukouMessageQueAddress);
  file.service.addEnvironment("JOUKOU_API_ADDR", joukouApiAddress);
  return file;
};

({
  generateConnectionKeys: function(ports) {
    var port, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = connections.length; _i < _len; _i++) {
      port = connections[_i];
      if (!port.exchangeKey) {
        port.exchangeKey = "FAKE_SOURCE";
        _results.push(port.routingKey = "FAKE_SOURCE");
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  checkForBrokenConnections: function(connections) {
    var connection, i, source, target, _results;
    i = 0;
    _results = [];
    while (i < connections.length) {
      i++;
      connection = connections[i];
      if (!_.isPlainObject(connection)) {
        continue;
      }
      target = connection["tgt"];
      source = connection["src"];
      if (!target && !source) {
        continue;
      }
      if (!_.isPlainObject(target)) {
        throw new Error("No target for connection " + i);
      }
      if (!_.isPlainObject(source)) {
        throw new Error("No source for connection " + i);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
});

findPorts = function(connections, processKey) {
  var connection, result, _i, _len;
  result = [];
  for (_i = 0, _len = connections.length; _i < _len; _i++) {
    connection = connections[_i];
    if (connection.tgt.process === processKey) {
      result.push({
        port: connection.tgt,
        connection: connection
      });
    }
    if (connection.src.process === processKey) {
      result.push({
        port: connection.src,
        connection: connection
      });
    }
  }
  return result;
};

module.exports = {
  createFromSchema: createFromSchema
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZmxvL3N5c3RlbWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsd0RBQUE7O0FBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsc0JBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxDQUNBLEdBQWtCLE9BQUEsQ0FBUSxRQUFSLENBRGxCLENBQUE7O0FBQUEsQ0FHQTtBQUFBLEVBQUEsZ0JBQUEsRUFBa0IsU0FBQyxLQUFELEVBQ0MsU0FERCxFQUVDLHVCQUZELEVBR0MsZ0JBSEQsR0FBQTtBQUloQixRQUFBLDRCQUFBO0FBQUEsSUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLGFBQUYsQ0FBZ0IsS0FBaEIsQ0FBUDtBQUNFLFlBQVUsSUFBQSxTQUFBLENBQVUsd0JBQVYsQ0FBVixDQURGO0tBQUE7QUFFQSxJQUFBLElBQUcsQ0FBQSxTQUFIO0FBQ0UsWUFBVSxJQUFBLEtBQUEsQ0FBTSx1QkFBTixDQUFWLENBREY7S0FGQTtBQUlBLElBQUEsSUFBRyxNQUFBLENBQUEsU0FBQSxLQUFzQixRQUF6QjtBQUNFLFlBQVUsSUFBQSxTQUFBLENBQVUsMkJBQVYsQ0FBVixDQURGO0tBSkE7QUFNQSxJQUFBLElBQUcsQ0FBQSxDQUFLLENBQUMsYUFBRixDQUFnQixLQUFLLENBQUMsVUFBdEIsQ0FBUDtBQUNFLFlBQVUsSUFBQSxTQUFBLENBQVUsbUNBQVYsQ0FBVixDQURGO0tBTkE7QUFRQSxJQUFBLElBQUcsQ0FBQSxDQUFLLENBQUMsYUFBRixDQUFnQixLQUFLLENBQUMsU0FBdEIsQ0FBUDtBQUNFLFlBQVUsSUFBQSxTQUFBLENBQVUsa0NBQVYsQ0FBVixDQURGO0tBUkE7QUFVQSxJQUFBLElBQUcsQ0FBQSxDQUFLLENBQUMsT0FBRixDQUFVLEtBQUssQ0FBQyxXQUFoQixDQUFQO0FBQ0UsWUFBVSxJQUFBLFNBQUEsQ0FBVSxtQ0FBVixDQUFWLENBREY7S0FWQTtBQUFBLElBWUEsSUFBQSxHQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFaeEIsQ0FB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T0FBWixDQUFBLENBREY7S0FORjtBQUFBLEdBREE7U0FZQSxPQWJVO0FBQUEsQ0F4R1osQ0FBQTs7QUFBQSxNQXVITSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsZ0JBQUEsRUFBa0IsZ0JBQWxCO0NBeEhGLENBQUEiLCJmaWxlIjoibm9mbG8vc3lzdGVtZC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIlN5c3RlbURVbml0RmlsZSA9IHJlcXVpcmUoXCIuLi9zeXN0ZW1kL3VuaXQtZmlsZVwiKVxuXyAgICAgICAgICAgICAgID0gcmVxdWlyZShcImxvZGFzaFwiKVxuXG5jcmVhdGVGcm9tU2NoZW1hOiAoaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgbWFjaGluZUlELFxuICAgICAgICAgICAgICAgICAgIGpvdWtvdU1lc3NhZ2VRdWVBZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgIGpvdWtvdUFwaUFkZHJlc3MpIC0+XG4gIGlmIG5vdCBfLmlzUGxhaW5PYmplY3QoaW5wdXQpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImlucHV0IGlzIG5vdCBhbiBvYmplY3RcIilcbiAgaWYgbm90IG1hY2hpbmVJRFxuICAgIHRocm93IG5ldyBFcnJvcihcIm1hY2hpbmVJRCBpcyByZXF1aXJlZFwiKVxuICBpZiB0eXBlb2YgbWFjaGluZUlEIGlzbnQgXCJzdHJpbmdcIlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJtYWNoaW5lSUQgaXMgbm90IGEgc3RyaW5nXCIpXG4gIGlmIG5vdCBfLmlzUGxhaW5PYmplY3QoaW5wdXQucHJvcGVydGllcylcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiaW5wdXQucHJvcGVydGllcyBpcyBub3QgYW4gb2JqZWN0XCIpXG4gIGlmIG5vdCBfLmlzUGxhaW5PYmplY3QoaW5wdXQucHJvY2Vzc2VzKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJpbnB1dC5wcm9jZXNzZXMgaXMgbm90IGFuIG9iamVjdFwiKVxuICBpZiBub3QgXy5pc0FycmF5KGlucHV0LmNvbm5lY3Rpb25zKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJpbnB1dC5jb25uZWN0aW9ucyBpcyBub3QgYW4gYXJyYXlcIilcbiAgbmFtZSA9IGlucHV0LnByb3BlcnRpZXMubmFtZVxuICBpZiBub3QgbmFtZVxuICAgIHRocm93IG5ldyBFcnJvcihcImlucHV0LnByb3BlcnRpZXMubmFtZSBpcyByZXF1aXJlZFwiKVxuICBjb25uZWN0aW9ucyA9IF8uY2xvbmVEZWVwKGlucHV0LmNvbm5lY3Rpb25zKVxuICBwcm9jZXNzZXMgPSBfLmNsb25lRGVlcChpbnB1dC5wcm9jZXNzZXMpXG4gIHJldHVybiBjcmVhdGVPcHRpb25zKG5hbWUsIHByb2Nlc3NlcywgY29ubmVjdGlvbnMpXG5cbmNyZWF0ZU9wdGlvbnMgPSAobmFtZSxcbiAgICAgICAgICAgICAgICAgcHJvY2Vzc2VzLFxuICAgICAgICAgICAgICAgICBjb25uZWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgbWFjaGluZUlELFxuICAgICAgICAgICAgICAgICBqb3Vrb3VNZXNzYWdlUXVlQWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgam91a291QXBpQWRkcmVzcykgLT5cbiAgb3B0aW9ucyA9IFtdXG4gICMjI1xuICB1c2UgZm9ybWF0XG4gIFtcbiAgICB7XG4gICAgICB1bml0TmFtZTogXCJuYW1lXCJcbiAgICAgIG9wdGlvbnM6IFtTeXN0ZW1EVW5pdEZpbGVdLm9wdGlvbnNcbiAgICAgIG1hY2hpbmVJRDogbWFjaGluZUlEXG4gICAgfVxuICBdXG4gICMjI1xuICBmb3IgcHJvY2Vzc0tleSBpbiBpbnB1dC5wcm9jZXNzZXNcbiAgICBpZiBub3QgaW5wdXQuaGFzT3duUHJvcGVydHkocHJvY2Vzc0tleSlcbiAgICAgIGNvbnRpbnVlXG4gICAgcHJvY2VzcyA9IGlucHV0LnByb2Nlc3Nlc1twcm9jZXNzS2V5XVxuICAgIHVuaXQgPSB7XG4gICAgICBwcm9jZXNzOiBwcm9jZXNzXG4gICAgICBwcm9jZXNzS2V5OiBwcm9jZXNzS2V5XG4gICAgICBtYWNoaW5lSUQ6IG1hY2hpbmVJRFxuICAgICAgZG9ja2VyQ29udGFpbmVyOiBwcm9jZXNzLmNvbXBvbmVudFxuICAgICAgcG9ydHM6IHRoaXMuZmluZFBvcnRzKGNvbm5lY3Rpb25zLCBwcm9jZXNzS2V5KVxuICAgIH1cbiAgICBmaWxlID0gY3JlYXRlRmlsZShcbiAgICAgIHVuaXQsXG4gICAgICBqb3Vrb3VNZXNzYWdlUXVlQWRkcmVzcyxcbiAgICAgIGpvdWtvdUFwaUFkZHJlc3NcbiAgICApXG4gICAgb3B0aW9ucy5wdXNoKHtcbiAgICAgIHVuaXROYW1lOiBwcm9jZXNzS2V5XG4gICAgICBvcHRpb25zOiBmaWxlLm9wdGlvbnNcbiAgICAgIG1hY2hpbmVJRDogbWFjaGluZUlEXG4gICAgfSlcblxuICByZXR1cm4gb3B0aW9uc1xuXG5jcmVhdGVGaWxlID0gKHVuaXQsXG4gICAgICAgICAgICAgIGpvdWtvdU1lc3NhZ2VRdWVBZGRyZXNzLFxuICAgICAgICAgICAgICBqb3Vrb3VBcGlBZGRyZXNzKSAtPlxuXG4gIGZpbGUgPSBuZXcgU3lzdGVtRFVuaXRGaWxlKClcbiAgZmlsZS5zZXJ2aWNlLmFkZEVudmlyb25tZW50KFwiSk9VS09VX0FNUVBfQUREUlwiLCBqb3Vrb3VNZXNzYWdlUXVlQWRkcmVzcylcbiAgZmlsZS5zZXJ2aWNlLmFkZEVudmlyb25tZW50KFwiSk9VS09VX0FQSV9BRERSXCIsIGpvdWtvdUFwaUFkZHJlc3MpXG5cblxuICByZXR1cm4gZmlsZVxuXG5cblxuZ2VuZXJhdGVDb25uZWN0aW9uS2V5czogKHBvcnRzKSAtPlxuICAjIE5vdCB0byBzdXJlIHdoYXQgSXNhYWMgd2FudHMgdG8gYmVcbiAgIyBkb25lIGhlcmUsIGFkZCBmYWtlcyBmb3Igbm93XG4gIGZvciBwb3J0IGluIGNvbm5lY3Rpb25zXG4gICAgaWYgbm90IHBvcnQuZXhjaGFuZ2VLZXlcbiAgICAgIHBvcnQuZXhjaGFuZ2VLZXkgPSBcIkZBS0VfU09VUkNFXCJcbiAgICAgIHBvcnQucm91dGluZ0tleSA9IFwiRkFLRV9TT1VSQ0VcIlxuXG5jaGVja0ZvckJyb2tlbkNvbm5lY3Rpb25zOiAoY29ubmVjdGlvbnMpIC0+XG4gIGkgPSAwXG4gIHdoaWxlIGkgPCBjb25uZWN0aW9ucy5sZW5ndGhcbiAgICBpKytcbiAgICBjb25uZWN0aW9uID0gY29ubmVjdGlvbnNbaV1cbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KGNvbm5lY3Rpb24pXG4gICAgICBjb250aW51ZVxuICAgIHRhcmdldCA9IGNvbm5lY3Rpb25bXCJ0Z3RcIl1cbiAgICBzb3VyY2UgPSBjb25uZWN0aW9uW1wic3JjXCJdXG4gICAgaWYgbm90IHRhcmdldCBhbmQgbm90IHNvdXJjZVxuICAgICAgY29udGludWVcbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KHRhcmdldClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHRhcmdldCBmb3IgY29ubmVjdGlvbiAje2l9XCIpXG4gICAgaWYgbm90IF8uaXNQbGFpbk9iamVjdChzb3VyY2UpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzb3VyY2UgZm9yIGNvbm5lY3Rpb24gI3tpfVwiKVxuXG5maW5kUG9ydHMgPSAoY29ubmVjdGlvbnMsIHByb2Nlc3NLZXkpIC0+XG4gIHJlc3VsdCA9IFtdXG4gIGZvciBjb25uZWN0aW9uIGluIGNvbm5lY3Rpb25zXG4gICAgaWYgY29ubmVjdGlvbi50Z3QucHJvY2VzcyBpcyBwcm9jZXNzS2V5XG4gICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgIHBvcnQ6IGNvbm5lY3Rpb24udGd0XG4gICAgICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb25cbiAgICAgIH0pXG4gICAgaWYgY29ubmVjdGlvbi5zcmMucHJvY2VzcyBpcyBwcm9jZXNzS2V5XG4gICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgIHBvcnQ6IGNvbm5lY3Rpb24uc3JjXG4gICAgICAgIGNvbm5lY3Rpb246IGNvbm5lY3Rpb25cbiAgICAgIH0pXG4gIHJlc3VsdFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNyZWF0ZUZyb21TY2hlbWE6IGNyZWF0ZUZyb21TY2hlbWEiXX0=
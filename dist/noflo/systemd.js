var SystemDUnitFile, checkForBrokenConnections, createFile, createFromSchema, createOptions, findPorts, generateConnectionKeys, _;

SystemDUnitFile = require("../systemd/unit-file");

_ = require("lodash");

createFromSchema = function(input, machineID, joukouMessageQueAddress, joukouApiAddress) {
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
  if (typeof joukouMessageQueAddress !== "string") {
    throw new TypeError("joukouMessageQueAddress is not a string");
  }
  if (typeof joukouApiAddress !== "string") {
    throw new TypeError("joukouApiAddress is not a string");
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
  checkForBrokenConnections(connections);
  processes = _.cloneDeep(input.processes);
  return createOptions(name, processes, connections, machineID, joukouMessageQueAddress, joukouApiAddress);
};

createOptions = function(name, processes, connections, machineID, joukouMessageQueAddress, joukouApiAddress) {
  var file, options, process, processKey, unit;
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
  for (processKey in processes) {
    if (!processes.hasOwnProperty(processKey)) {
      continue;
    }
    process = processes[processKey];
    unit = {
      process: process,
      processKey: processKey,
      machineID: machineID,
      dockerContainer: process.component,
      ports: findPorts(connections, processKey)
    };
    generateConnectionKeys(unit.ports);
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
  var file, key, port, _i, _len, _ref;
  file = new SystemDUnitFile();
  file.service.addEnvironment("JOUKOU_AMQP_ADDR", joukouMessageQueAddress);
  file.service.addEnvironment("JOUKOU_API_ADDR", joukouApiAddress);
  _ref = unit.ports;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    port = _ref[_i];
    key = "JOUKOU_CIRCLE_" + port.type + "_" + port.name + "_";
    file.service.addEnvironment("" + key + "EXCHANGE", port.port.exchangeKey);
    file.service.addEnvironment("" + key + "ROUTING_KEY", port.port.routingKey);
  }
  file.service.addUser("root");
  file.service.addType("notify");
  file.service.addNotifyAccess("all");
  file.service.addTimeoutStartSec("12min");
  file.service.addTimeoutStopSec("15");
  file.service.addRestart("on-failure");
  file.service.addRestartSec("10s");
  file.service.addEnvironmentFile("/run/docker.env");
  file.service.addExecStartPre("/usr/bin/docker run --rm -v /opt/bin:/opt/bin ibuildthecloud/systemd-docker");
  file.service.addExecStartPre("/usr/bin/docker pull " + unit.dockerContainer);
  file.service.addExecStartPre("-/usr/bin/docker kill %p");
  file.service.addExecStartPre("-/usr/bin/docker rm %p");
  file.service.addExecStart("/opt/bin/systemd-docker run --name %p " + unit.dockerContainer);
  file.service.addExecStop("/usr/bin/docker kill %p");
  file.unit.addDescription("Unit for " + unit.dockerContainer);
  file.unit.addDocumentation(unit.dockerContainer);
  file.unit.addAfter("docker.service");
  file.unit.addRequires("docker.service");
  file.unit.addAfter("rabbitmq.service");
  file.unit.addRequires("rabbitmq.service");
  file.unit.addAfter("riak.service");
  file.unit.addRequires("riak.service");
  return file;
};

generateConnectionKeys = function(ports) {
  var port, portObject, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = ports.length; _i < _len; _i++) {
    portObject = ports[_i];
    port = portObject.port;
    if (!port.exchangeKey) {
      port.exchangeKey = "FAKE_EXCHANGE";
      _results.push(port.routingKey = "FAKE_ROUTING");
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

checkForBrokenConnections = function(connections) {
  var connection, i, source, target, _results;
  i = 0;
  _results = [];
  while (i < connections.length) {
    connection = connections[i];
    i++;
    if (!_.isPlainObject(connection)) {
      continue;
    }
    target = connection["tgt"];
    source = connection["src"];
    if (!target && !source) {
      continue;
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

findPorts = function(connections, processKey) {
  var connection, result, _i, _len;
  result = [];
  for (_i = 0, _len = connections.length; _i < _len; _i++) {
    connection = connections[_i];
    if (connection.tgt) {
      if (connection.tgt.process === processKey) {
        result.push({
          type: "INPORT",
          name: connection.tgt.port,
          port: connection.tgt,
          connection: connection
        });
      }
    }
    if (connection.src) {
      if (connection.src.process === processKey) {
        result.push({
          type: "OUTPORT",
          name: connection.src.port,
          port: connection.src,
          connection: connection
        });
      }
    }
  }
  return result;
};

module.exports = {
  createFromSchema: createFromSchema
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZmxvL3N5c3RlbWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsNkhBQUE7O0FBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEsc0JBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxDQUNBLEdBQWtCLE9BQUEsQ0FBUSxRQUFSLENBRGxCLENBQUE7O0FBQUEsZ0JBR0EsR0FBbUIsU0FBQyxLQUFELEVBQ0EsU0FEQSxFQUVBLHVCQUZBLEVBR0EsZ0JBSEEsR0FBQTtBQUlqQixNQUFBLDRCQUFBO0FBQUEsRUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLGFBQUYsQ0FBZ0IsS0FBaEIsQ0FBUDtBQUNFLFVBQVUsSUFBQSxTQUFBLENBQVUsd0JBQVYsQ0FBVixDQURGO0dBQUE7QUFFQSxFQUFBLElBQUcsQ0FBQSxTQUFIO0FBQ0UsVUFBVSxJQUFBLEtBQUEsQ0FBTSx1QkFBTixDQUFWLENBREY7R0FGQTtBQUlBLEVBQUEsSUFBRyxNQUFBLENBQUEsU0FBQSxLQUFzQixRQUF6QjtBQUNFLFVBQVUsSUFBQSxTQUFBLENBQVUsMkJBQVYsQ0FBVixDQURGO0dBSkE7QUFNQSxFQUFBLElBQUcsTUFBQSxDQUFBLHVCQUFBLEtBQW9DLFFBQXZDO0FBQ0UsVUFBVSxJQUFBLFNBQUEsQ0FBVSx5Q0FBVixDQUFWLENBREY7R0FOQTtBQVFBLEVBQUEsSUFBRyxNQUFBLENBQUEsZ0JBQUEsS0FBNkIsUUFBaEM7QUFDRSxVQUFVLElBQUEsU0FBQSxDQUFVLGtDQUFWLENBQVYsQ0FERjtHQVJBO0FBVUEsRUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLGFBQUYsQ0FBZ0IsS0FBSyxDQUFDLFVBQXRCLENBQVA7QUFDRSxVQUFVLElBQUEsU0FBQSxDQUFVLG1DQUFWLENBQVYsQ0FERjtHQVZBO0FBWUEsRUFBQSxJQUFHLENBQUEsQ0FBSyxDQUFDLGFBQUYsQ0FBZ0IsS0FBSyxDQUFDLFNBQXRCLENBQVA7QUFDRSxVQUFVLElBQUEsU0FBQSxDQUFVLGtDQUFWLENBQVYsQ0FE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R0FBRyxDQUFDLE9BQWYsS0FBMEIsVUFBN0I7QUFDRSxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVk7QUFBQSxVQUNWLElBQUEsRUFBTSxTQURJO0FBQUEsVUFFVixJQUFBLEVBQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUZYO0FBQUEsVUFHVixJQUFBLEVBQU0sVUFBVSxDQUFDLEdBSFA7QUFBQSxVQUlWLFVBQUEsRUFBWSxVQUpGO1NBQVosQ0FBQSxDQURGO09BREY7S0FURjtBQUFBLEdBREE7U0FrQkEsT0FuQlU7QUFBQSxDQTVLWixDQUFBOztBQUFBLE1BaU1NLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxnQkFBQSxFQUFrQixnQkFBbEI7Q0FsTUYsQ0FBQSIsImZpbGUiOiJub2Zsby9zeXN0ZW1kLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiU3lzdGVtRFVuaXRGaWxlID0gcmVxdWlyZShcIi4uL3N5c3RlbWQvdW5pdC1maWxlXCIpXG5fICAgICAgICAgICAgICAgPSByZXF1aXJlKFwibG9kYXNoXCIpXG5cbmNyZWF0ZUZyb21TY2hlbWEgPSAoaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgbWFjaGluZUlELFxuICAgICAgICAgICAgICAgICAgIGpvdWtvdU1lc3NhZ2VRdWVBZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgIGpvdWtvdUFwaUFkZHJlc3MpIC0+XG4gIGlmIG5vdCBfLmlzUGxhaW5PYmplY3QoaW5wdXQpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImlucHV0IGlzIG5vdCBhbiBvYmplY3RcIilcbiAgaWYgbm90IG1hY2hpbmVJRFxuICAgIHRocm93IG5ldyBFcnJvcihcIm1hY2hpbmVJRCBpcyByZXF1aXJlZFwiKVxuICBpZiB0eXBlb2YgbWFjaGluZUlEIGlzbnQgXCJzdHJpbmdcIlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJtYWNoaW5lSUQgaXMgbm90IGEgc3RyaW5nXCIpXG4gIGlmIHR5cGVvZiBqb3Vrb3VNZXNzYWdlUXVlQWRkcmVzcyBpc250IFwic3RyaW5nXCJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiam91a291TWVzc2FnZVF1ZUFkZHJlc3MgaXMgbm90IGEgc3RyaW5nXCIpXG4gIGlmIHR5cGVvZiBqb3Vrb3VBcGlBZGRyZXNzIGlzbnQgXCJzdHJpbmdcIlxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJqb3Vrb3VBcGlBZGRyZXNzIGlzIG5vdCBhIHN0cmluZ1wiKVxuICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KGlucHV0LnByb3BlcnRpZXMpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImlucHV0LnByb3BlcnRpZXMgaXMgbm90IGFuIG9iamVjdFwiKVxuICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KGlucHV0LnByb2Nlc3NlcylcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiaW5wdXQucHJvY2Vzc2VzIGlzIG5vdCBhbiBvYmplY3RcIilcbiAgaWYgbm90IF8uaXNBcnJheShpbnB1dC5jb25uZWN0aW9ucylcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiaW5wdXQuY29ubmVjdGlvbnMgaXMgbm90IGFuIGFycmF5XCIpXG4gIG5hbWUgPSBpbnB1dC5wcm9wZXJ0aWVzLm5hbWVcbiAgaWYgbm90IG5hbWVcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnB1dC5wcm9wZXJ0aWVzLm5hbWUgaXMgcmVxdWlyZWRcIilcbiAgY29ubmVjdGlvbnMgPSBfLmNsb25lRGVlcChpbnB1dC5jb25uZWN0aW9ucylcbiAgY2hlY2tGb3JCcm9rZW5Db25uZWN0aW9ucyhjb25uZWN0aW9ucylcbiAgcHJvY2Vzc2VzID0gXy5jbG9uZURlZXAoaW5wdXQucHJvY2Vzc2VzKVxuICByZXR1cm4gY3JlYXRlT3B0aW9ucyhcbiAgICBuYW1lLFxuICAgIHByb2Nlc3NlcyxcbiAgICBjb25uZWN0aW9ucyxcbiAgICBtYWNoaW5lSUQsXG4gICAgam91a291TWVzc2FnZVF1ZUFkZHJlc3MsXG4gICAgam91a291QXBpQWRkcmVzc1xuICApXG5cbmNyZWF0ZU9wdGlvbnMgPSAobmFtZSxcbiAgICAgICAgICAgICAgICAgcHJvY2Vzc2VzLFxuICAgICAgICAgICAgICAgICBjb25uZWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgbWFjaGluZUlELFxuICAgICAgICAgICAgICAgICBqb3Vrb3VNZXNzYWdlUXVlQWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgam91a291QXBpQWRkcmVzcykgLT5cbiAgb3B0aW9ucyA9IFtdXG4gICMjI1xuICB1c2UgZm9ybWF0XG4gIFtcbiAgICB7XG4gICAgICB1bml0TmFtZTogXCJuYW1lXCJcbiAgICAgIG9wdGlvbnM6IFtTeXN0ZW1EVW5pdEZpbGVdLm9wdGlvbnNcbiAgICAgIG1hY2hpbmVJRDogbWFjaGluZUlEXG4gICAgfVxuICBdXG4gICMjI1xuICBmb3IgcHJvY2Vzc0tleSBvZiBwcm9jZXNzZXNcbiAgICBpZiBub3QgcHJvY2Vzc2VzLmhhc093blByb3BlcnR5KHByb2Nlc3NLZXkpXG4gICAgICBjb250aW51ZVxuICAgIHByb2Nlc3MgPSBwcm9jZXNzZXNbcHJvY2Vzc0tleV1cbiAgICB1bml0ID0ge1xuICAgICAgcHJvY2VzczogcHJvY2Vzc1xuICAgICAgcHJvY2Vzc0tleTogcHJvY2Vzc0tleVxuICAgICAgbWFjaGluZUlEOiBtYWNoaW5lSURcbiAgICAgIGRvY2tlckNvbnRhaW5lcjogcHJvY2Vzcy5jb21wb25lbnRcbiAgICAgIHBvcnRzOiBmaW5kUG9ydHMoY29ubmVjdGlvbnMsIHByb2Nlc3NLZXkpXG4gICAgfVxuICAgIGdlbmVyYXRlQ29ubmVjdGlvbktleXModW5pdC5wb3J0cylcbiAgICBmaWxlID0gY3JlYXRlRmlsZShcbiAgICAgIHVuaXQsXG4gICAgICBqb3Vrb3VNZXNzYWdlUXVlQWRkcmVzcyxcbiAgICAgIGpvdWtvdUFwaUFkZHJlc3NcbiAgICApXG4gICAgb3B0aW9ucy5wdXNoKHtcbiAgICAgIHVuaXROYW1lOiBwcm9jZXNzS2V5XG4gICAgICBvcHRpb25zOiBmaWxlLm9wdGlvbnNcbiAgICAgIG1hY2hpbmVJRDogbWFjaGluZUlEXG4gICAgfSlcblxuICByZXR1cm4gb3B0aW9uc1xuXG5jcmVhdGVGaWxlID0gKHVuaXQsXG4gICAgICAgICAgICAgIGpvdWtvdU1lc3NhZ2VRdWVBZGRyZXNzLFxuICAgICAgICAgICAgICBqb3Vrb3VBcGlBZGRyZXNzKSAtPlxuXG4gIGZpbGUgPSBuZXcgU3lzdGVtRFVuaXRGaWxlKClcbiAgZmlsZS5zZXJ2aWNlLmFkZEVudmlyb25tZW50KFwiSk9VS09VX0FNUVBfQUREUlwiLCBqb3Vrb3VNZXNzYWdlUXVlQWRkcmVzcylcbiAgZmlsZS5zZXJ2aWNlLmFkZEVudmlyb25tZW50KFwiSk9VS09VX0FQSV9BRERSXCIsIGpvdWtvdUFwaUFkZHJlc3MpXG5cbiAgZm9yIHBvcnQgaW4gdW5pdC5wb3J0c1xuICAgIGtleSA9IFwiSk9VS09VX0NJUkNMRV8je3BvcnQudHlwZX1fI3twb3J0Lm5hbWV9X1wiXG4gICAgZmlsZS5zZXJ2aWNlLmFkZEVudmlyb25tZW50KFwiI3trZXl9RVhDSEFOR0VcIiwgcG9ydC5wb3J0LmV4Y2hhbmdlS2V5KVxuICAgIGZpbGUuc2VydmljZS5hZGRFbnZpcm9ubWVudChcIiN7a2V5fVJPVVRJTkdfS0VZXCIsIHBvcnQucG9ydC5yb3V0aW5nS2V5KVxuXG4gICMgUnVuIGFzIHJvb3QgYmVjYXVzZVxuICAjIC0gc3lzdGVtZC1kb2NrZXIgcmVxdWlyZXMgcm9vdCBwcml2aWxlZ2VzXG4gICMgLSAvcm9vdC8uZG9ja2VyY2ZnIGZvciByZWdpc3RyeSBhdXRoZW50aWNhdGlvblxuICBmaWxlLnNlcnZpY2UuYWRkVXNlcihcInJvb3RcIilcblxuICAjIHNkX25vdGlmeSgzKSBpcyByZXF1aXJlZCBieSBzeXN0ZW1kLWRvY2tlclxuICBmaWxlLnNlcnZpY2UuYWRkVHlwZShcIm5vdGlmeVwiKVxuICBmaWxlLnNlcnZpY2UuYWRkTm90aWZ5QWNjZXNzKFwiYWxsXCIpXG5cbiAgIyBMYXJnZSBzdGFydCB0aW1lb3V0IGlzIHRvIGFsbG93IGZvciBwdWxsaW5nIGRvd24gRG9ja2VyIGltYWdlcyBmcm9tIHF1YXkuaW9cbiAgZmlsZS5zZXJ2aWNlLmFkZFRpbWVvdXRTdGFydFNlYyhcIjEybWluXCIpXG4gIGZpbGUuc2VydmljZS5hZGRUaW1lb3V0U3RvcFNlYyhcIjE1XCIpXG5cbiAgZmlsZS5zZXJ2aWNlLmFkZFJlc3RhcnQoXCJvbi1mYWlsdXJlXCIpXG4gIGZpbGUuc2VydmljZS5hZGRSZXN0YXJ0U2VjKFwiMTBzXCIpXG5cbiAgZmlsZS5zZXJ2aWNlLmFkZEVudmlyb25tZW50RmlsZShcIi9ydW4vZG9ja2VyLmVudlwiKVxuXG4gIGZpbGUuc2VydmljZS5hZGRFeGVjU3RhcnRQcmUoXG4gICAgXCIvdXNyL2Jpbi9kb2NrZXIgcnVuIC0tcm0gLXYgL29wdC9iaW46L29wdC9iaW4gaWJ1aWxkdGhlY2xvdWQvc3lzdGVtZC1kb2NrZXJcIlxuICApXG4gIGZpbGUuc2VydmljZS5hZGRFeGVjU3RhcnRQcmUoXG4gICAgXCIvdXNyL2Jpbi9kb2NrZXIgcHVsbCAje3VuaXQuZG9ja2VyQ29udGFpbmVyfVwiXG4gIClcblxuICBmaWxlLnNlcnZpY2UuYWRkRXhlY1N0YXJ0UHJlKFwiLS91c3IvYmluL2RvY2tlciBraWxsICVwXCIpXG4gIGZpbGUuc2VydmljZS5hZGRFeGVjU3RhcnRQcmUoXCItL3Vzci9iaW4vZG9ja2VyIHJtICVwXCIpXG5cbiAgZmlsZS5zZXJ2aWNlLmFkZEV4ZWNTdGFydChcbiAgICBcIi9vcHQvYmluL3N5c3RlbWQtZG9ja2VyIHJ1biAtLW5hbWUgJXAgI3t1bml0LmRvY2tlckNvbnRhaW5lcn1cIlxuICApXG5cbiAgZmlsZS5zZXJ2aWNlLmFkZEV4ZWNTdG9wKFwiL3Vzci9iaW4vZG9ja2VyIGtpbGwgJXBcIilcblxuICBmaWxlLnVuaXQuYWRkRGVzY3JpcHRpb24oXCJVbml0IGZvciAje3VuaXQuZG9ja2VyQ29udGFpbmVyfVwiKVxuICBmaWxlLnVuaXQuYWRkRG9jdW1lbnRhdGlvbih1bml0LmRvY2tlckNvbnRhaW5lcilcblxuICAjIFJlcXVpcmVzIGRvY2tlclxuICBmaWxlLnVuaXQuYWRkQWZ0ZXIoXCJkb2NrZXIuc2VydmljZVwiKVxuICBmaWxlLnVuaXQuYWRkUmVxdWlyZXMoXCJkb2NrZXIuc2VydmljZVwiKVxuXG4gICMgUmVxdWlyZXMgcmFiYml0bXFcbiAgZmlsZS51bml0LmFkZEFmdGVyKFwicmFiYml0bXEuc2VydmljZVwiKVxuICBmaWxlLnVuaXQuYWRkUmVxdWlyZXMoXCJyYWJiaXRtcS5zZXJ2aWNlXCIpXG5cbiAgIyBSZXF1aXJlcyByaWFrIChkb2VzIGl0PylcbiAgZmlsZS51bml0LmFkZEFmdGVyKFwicmlhay5zZXJ2aWNlXCIpXG4gIGZpbGUudW5pdC5hZGRSZXF1aXJlcyhcInJpYWsuc2VydmljZVwiKVxuXG4gICMgQWRkIGFueSBtb3JlIHJlcXVpcmVkIHVuaXRzXG5cbiAgcmV0dXJuIGZpbGVcblxuZ2VuZXJhdGVDb25uZWN0aW9uS2V5cyA9IChwb3J0cykgLT5cbiAgIyBOb3QgdG8gc3VyZSB3aGF0IElzYWFjIHdhbnRzIHRvIGJlXG4gICMgZG9uZSBoZXJlLCBhZGQgZmFrZXMgZm9yIG5vd1xuICBmb3IgcG9ydE9iamVjdCBpbiBwb3J0c1xuICAgIHBvcnQgPSBwb3J0T2JqZWN0LnBvcnRcbiAgICBpZiBub3QgcG9ydC5leGNoYW5nZUtleVxuICAgICAgcG9ydC5leGNoYW5nZUtleSA9IFwiRkFLRV9FWENIQU5HRVwiXG4gICAgICBwb3J0LnJvdXRpbmdLZXkgPSBcIkZBS0VfUk9VVElOR1wiXG5cbmNoZWNrRm9yQnJva2VuQ29ubmVjdGlvbnMgPSAoY29ubmVjdGlvbnMpIC0+XG4gIGkgPSAwXG4gIHdoaWxlIGkgPCBjb25uZWN0aW9ucy5sZW5ndGhcbiAgICBjb25uZWN0aW9uID0gY29ubmVjdGlvbnNbaV1cbiAgICBpKytcbiAgICBpZiBub3QgXy5pc1BsYWluT2JqZWN0KGNvbm5lY3Rpb24pXG4gICAgICBjb250aW51ZVxuICAgIHRhcmdldCA9IGNvbm5lY3Rpb25bXCJ0Z3RcIl1cbiAgICBzb3VyY2UgPSBjb25uZWN0aW9uW1wic3JjXCJdXG4gICAgaWYgbm90IHRhcmdldCBhbmQgbm90IHNvdXJjZVxuICAgICAgY29udGludWVcbiAgICAjQ29tbWVudCBvdXQgZm9yIG5vdyBzbyB3ZSBjYW4gZG8gZGVtb3Mgd2l0aCBwaG90b2Jvb3RoLmpzb25cbiAgICAjaWYgbm90IF8uaXNQbGFpbk9iamVjdCh0YXJnZXQpXG4gICAgIyAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGFyZ2V0IGZvciBjb25uZWN0aW9uICN7aX1cIilcbiAgICAjaWYgbm90IF8uaXNQbGFpbk9iamVjdChzb3VyY2UpXG4gICAgIyAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc291cmNlIGZvciBjb25uZWN0aW9uICN7aX1cIilcblxuZmluZFBvcnRzID0gKGNvbm5lY3Rpb25zLCBwcm9jZXNzS2V5KSAtPlxuICByZXN1bHQgPSBbXVxuICBmb3IgY29ubmVjdGlvbiBpbiBjb25uZWN0aW9uc1xuICAgIGlmIGNvbm5lY3Rpb24udGd0XG4gICAgICBpZiBjb25uZWN0aW9uLnRndC5wcm9jZXNzIGlzIHByb2Nlc3NLZXlcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIHR5cGU6IFwiSU5QT1JUXCJcbiAgICAgICAgICBuYW1lOiBjb25uZWN0aW9uLnRndC5wb3J0XG4gICAgICAgICAgcG9ydDogY29ubmVjdGlvbi50Z3RcbiAgICAgICAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uXG4gICAgICAgIH0pXG4gICAgaWYgY29ubmVjdGlvbi5zcmNcbiAgICAgIGlmIGNvbm5lY3Rpb24uc3JjLnByb2Nlc3MgaXMgcHJvY2Vzc0tleVxuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgdHlwZTogXCJPVVRQT1JUXCJcbiAgICAgICAgICBuYW1lOiBjb25uZWN0aW9uLnNyYy5wb3J0XG4gICAgICAgICAgcG9ydDogY29ubmVjdGlvbi5zcmNcbiAgICAgICAgICBjb25uZWN0aW9uOiBjb25uZWN0aW9uXG4gICAgICAgIH0pXG4gIHJlc3VsdFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNyZWF0ZUZyb21TY2hlbWE6IGNyZWF0ZUZyb21TY2hlbWEiXX0=
var ConductorRabbitMQClient, JoukouConductorExchange, JoukouConductorRoutingKey, RabbitMQClient, singleton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

JoukouConductorExchange = process.env["JOUKOU_CONDUCTOR_EXCHANGE"];

JoukouConductorRoutingKey = process.env["JOUKOU_CONDUCTOR_ROUTING_KEY"];

RabbitMQClient = require('./client').RabbitMQClient;

if (!JoukouConductorExchange) {
  JoukouConductorExchange = "amqp://localhost";
  process.env["JOUKOU_CONDUCTOR_EXCHANGE"] = JoukouConductorExchange;
}

if (!JoukouConductorRoutingKey) {
  JoukouConductorRoutingKey = "CONDUCTOR";
  process.env["JOUKOU_CONDUCTOR_ROUTING_KEY"] = JoukouConductorRoutingKey;
}

ConductorRabbitMQClient = (function(_super) {
  __extends(ConductorRabbitMQClient, _super);

  function ConductorRabbitMQClient() {
    var client;
    ConductorRabbitMQClient.__super__.constructor.call(this, JoukouConductorExchange, JoukouConductorRoutingKey);
    client = this;
    this.consume(function() {
      return client._consume.apply(client, arguments);
    }, true);
  }

  ConductorRabbitMQClient.prototype._consume = function(message) {};

  return ConductorRabbitMQClient;

})(RabbitMQClient);

singleton = null;

module.exports = {
  listen: function() {
    return new ConductorRabbitMQClient();
  },
  ConductorRabbitMQClient: ConductorRabbitMQClient
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJhYml0bXEvY29uZHVjdG9yLWNsaWVudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxzR0FBQTtFQUFBO2lTQUFBOztBQUFBLHVCQUFBLEdBQTRCLE9BQU8sQ0FBQyxHQUFJLENBQUEsMkJBQUEsQ0FBeEMsQ0FBQTs7QUFBQSx5QkFDQSxHQUE0QixPQUFPLENBQUMsR0FBSSxDQUFBLDhCQUFBLENBRHhDLENBQUE7O0FBQUEsY0FFQSxHQUE0QixPQUFBLENBQVEsVUFBUixDQUFtQixDQUFDLGNBRmhELENBQUE7O0FBTUEsSUFBRyxDQUFBLHVCQUFIO0FBQ0UsRUFBQSx1QkFBQSxHQUEwQixrQkFBMUIsQ0FBQTtBQUFBLEVBQ0EsT0FBTyxDQUFDLEdBQUksQ0FBQSwyQkFBQSxDQUFaLEdBQTJDLHVCQUQzQyxDQURGO0NBTkE7O0FBVUEsSUFBRyxDQUFBLHlCQUFIO0FBQ0UsRUFBQSx5QkFBQSxHQUE0QixXQUE1QixDQUFBO0FBQUEsRUFDQSxPQUFPLENBQUMsR0FBSSxDQUFBLDhCQUFBLENBQVosR0FBOEMseUJBRDlDLENBREY7Q0FWQTs7QUFBQTtBQWVFLDRDQUFBLENBQUE7O0FBQWEsRUFBQSxpQ0FBQSxHQUFBO0FBQ1gsUUFBQSxNQUFBO0FBQUEsSUFBQSx5REFBTSx1QkFBTixFQUErQix5QkFBL0IsQ0FBQSxDQUFBO0FBQUEsSUFDQSxNQUFBLEdBQVMsSUFEVCxDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsT0FBTCxDQUFjLFNBQUEsR0FBQTthQUNaLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBaEIsQ0FBc0IsTUFBdEIsRUFBOEIsU0FBOUIsRUFEWTtJQUFBLENBQWQsRUFFRSxJQUZGLENBRkEsQ0FEVztFQUFBLENBQWI7O0FBQUEsb0NBTUEsUUFBQSxHQUFVLFNBQUMsT0FBRCxHQUFBLENBTlYsQ0FBQTs7aUNBQUE7O0dBRG9DLGVBZHRDLENBQUE7O0FBQUEsU0F1QkEsR0FBWSxJQXZCWixDQUFBOztBQUFBLE1Bd0JNLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxNQUFBLEVBQVEsU0FBQSxHQUFBO1dBQ0YsSUFBQSx1QkFBQSxDQUFBLEVBREU7RUFBQSxDQUFSO0FBQUEsRUFFQSx1QkFBQSxFQUF5Qix1QkFGekI7Q0F6QkYsQ0FBQSIsImZpbGUiOiJyYWJpdG1xL2NvbmR1Y3Rvci1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJKb3Vrb3VDb25kdWN0b3JFeGNoYW5nZSAgID0gcHJvY2Vzcy5lbnZbXCJKT1VLT1VfQ09ORFVDVE9SX0VYQ0hBTkdFXCJdXG5Kb3Vrb3VDb25kdWN0b3JSb3V0aW5nS2V5ID0gcHJvY2Vzcy5lbnZbXCJKT1VLT1VfQ09ORFVDVE9SX1JPVVRJTkdfS0VZXCJdXG5SYWJiaXRNUUNsaWVudCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9jbGllbnQnKS5SYWJiaXRNUUNsaWVudFxuXG4jIFNldCB0aGUgRU5WIHZhcmlhYmxlIGZvciBuZXh0IHRpbWVcbiMgVGhpcyBkb2VzIG5vdCBlZmZlY3QgZ2xvYmFsIGVudiBqdXN0IHRoaXMgcHJvY2Vzc1xuaWYgbm90IEpvdWtvdUNvbmR1Y3RvckV4Y2hhbmdlXG4gIEpvdWtvdUNvbmR1Y3RvckV4Y2hhbmdlID0gXCJhbXFwOi8vbG9jYWxob3N0XCJcbiAgcHJvY2Vzcy5lbnZbXCJKT1VLT1VfQ09ORFVDVE9SX0VYQ0hBTkdFXCJdID0gSm91a291Q29uZHVjdG9yRXhjaGFuZ2VcblxuaWYgbm90IEpvdWtvdUNvbmR1Y3RvclJvdXRpbmdLZXlcbiAgSm91a291Q29uZHVjdG9yUm91dGluZ0tleSA9IFwiQ09ORFVDVE9SXCJcbiAgcHJvY2Vzcy5lbnZbXCJKT1VLT1VfQ09ORFVDVE9SX1JPVVRJTkdfS0VZXCJdID0gSm91a291Q29uZHVjdG9yUm91dGluZ0tleVxuXG5jbGFzcyBDb25kdWN0b3JSYWJiaXRNUUNsaWVudCBleHRlbmRzIFJhYmJpdE1RQ2xpZW50XG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyKEpvdWtvdUNvbmR1Y3RvckV4Y2hhbmdlLCBKb3Vrb3VDb25kdWN0b3JSb3V0aW5nS2V5KVxuICAgIGNsaWVudCA9IHRoaXNcbiAgICB0aGlzLmNvbnN1bWUoIC0+XG4gICAgICBjbGllbnQuX2NvbnN1bWUuYXBwbHkoY2xpZW50LCBhcmd1bWVudHMpXG4gICAgLCB0cnVlKVxuICBfY29uc3VtZTogKG1lc3NhZ2UpIC0+XG5cbnNpbmdsZXRvbiA9IG51bGxcbm1vZHVsZS5leHBvcnRzID1cbiAgbGlzdGVuOiAtPlxuICAgIG5ldyBDb25kdWN0b3JSYWJiaXRNUUNsaWVudCgpXG4gIENvbmR1Y3RvclJhYmJpdE1RQ2xpZW50OiBDb25kdWN0b3JSYWJiaXRNUUNsaWVudFxuIl19
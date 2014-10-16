
/**
@module joukou-conductor/fleet/index
@author Fabian Cook <fabian.cook@joukou.com>
@copyright (c) 2009-2014 Joukou Ltd. All rights reserved.
 */
var FleetClient, Q, discovery;

Q = require("q");

discovery = require("./discovery/client");

FleetClient = (function() {

  /**
  @type {DiscoveryClient}
   */
  FleetClient.prototype.discoveryClient = null;

  function FleetClient(endpoint, basePath, doDiscovery) {
    this.discoveryClient = discovery.getClient(endpoint, basePath, false);
    if (doDiscovery) {
      this.discoveryClient.doDiscovery();
    }
    return this;
  }

  FleetClient.prototype.createUnit = function(name, options, desiredState, currentState, machineID) {

    /*
      parameters:
        unitName: string
          required
      request:
        $ref: Unit
        schema: object
          properties:
            name:string
            options: array
              items:
                $ref: UnitOptions
                schema:
                  section: string
                  name: string
                  value: string
            desiredState: string
            currentState: string
            machineID: string
              required
     */
    return this.discoveryClient.on.method("Unit", "Set", [
      {
        unitName: name
      }, {
        name: name,
        options: options,
        desiredState: desiredState,
        currentState: currentState,
        machineID: machineID
      }
    ]);
  };

  FleetClient.prototype.setUnitDesiredState = function(name, desiredState, machineID) {

    /*
      parameters:
        unitName: string
          required
      request:
        $ref: Unit
        schema: object
          properties:
            desiredState: string
            machineID: string
              required
     */
    return this.discoveryClient.on.method("Unit", "Set", [
      {
        unitName: name
      }, {
        desiredState: desiredState,
        machineID: machineID
      }
    ]);
  };

  FleetClient.prototype.getUnitDesiredState = function(name) {

    /*
      parameters:
        unitName: string
          required
     */
    return this.discoveryClient.on.method("Unit", "Get", [
      {
        unitName: name
      }
    ]);
  };

  FleetClient.prototype.getUnitDesiredStates = function() {
    return this.discoveryClient.on.method("UnitStates", "List", []);
  };

  FleetClient.prototype.destroyUnit = function(unitName) {

    /*
      parameters:
        unitName: string
          required
     */
    return this.discoveryClient.on.method("Unit", "Delete", [
      {
        unitName: unitName
      }
    ]);
  };

  FleetClient.prototype.getMachineStates = function(machineID) {
    return this.getStates({
      machineID: machineID
    });
  };

  FleetClient.prototype.getUnitStates = function(unitName) {
    return this.getStates({
      unitName: unitName
    });
  };

  FleetClient.prototype.getStates = function(opts) {
    return this.discoveryClient.on.method("UnitStates", "List", [opts]);
  };

  FleetClient.prototype.getMachines = function() {
    return this.discoveryClient.on.method("Machines", "List", []);
  };

  return FleetClient;

})();

module.exports = {
  getClient: function(endpoint, basePath, doDiscovery) {
    return new FleetClient(endpoint, basePath, doDiscovery);
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBOzs7O0dBQUE7QUFBQSxJQUFBLHlCQUFBOztBQUFBLENBTUEsR0FBWSxPQUFBLENBQVEsR0FBUixDQU5aLENBQUE7O0FBQUEsU0FPQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUixDQVBaLENBQUE7O0FBQUE7QUFVRTtBQUFBOztLQUFBO0FBQUEsd0JBR0EsZUFBQSxHQUFpQixJQUhqQixDQUFBOztBQUlhLEVBQUEscUJBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsV0FBckIsR0FBQTtBQUNYLElBQUEsSUFBSSxDQUFDLGVBQUwsR0FBdUIsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsUUFBcEIsRUFBOEIsUUFBOUIsRUFBd0MsS0FBeEMsQ0FBdkIsQ0FBQTtBQUNBLElBQUEsSUFBRyxXQUFIO0FBQ0UsTUFBQSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQXJCLENBQUEsQ0FBQSxDQURGO0tBREE7QUFHQSxXQUFPLElBQVAsQ0FKVztFQUFBLENBSmI7O0FBQUEsd0JBVUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsWUFBaEIsRUFBOEIsWUFBOUIsRUFBNEMsU0FBNUMsR0FBQTtBQUNWO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BQUE7V0FxQkEsSUFBSSxDQUFDLGVBQ0gsQ0FBQyxFQUFFLENBQUMsTUFETixDQUNhLE1BRGIsRUFDcUIsS0FEckIsRUFDNEI7TUFDeEI7QUFBQSxRQUNBLFFBQUEsRUFBVSxJQURWO09BRHdCLEVBSXhCO0FBQUEsUUFDRSxJQUFBLEVBQU0sSUFEUjtBQUFBLFFBRUUsT0FBQSxFQUFTLE9BRlg7QUFBQSxRQUdFLFlBQUEsRUFBYyxZQUhoQjtBQUFBLFFBSUUsWUFBQSxFQUFjLFlBSmhCO0FBQUEsUUFLRSxTQUFBLEVBQVcsU0FMYjtPQUp3QjtLQUQ1QixFQXRCVTtFQUFBLENBVlosQ0FBQTs7QUFBQSx3QkE4Q0EsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEVBQU8sWUFBUCxFQUFxQixTQUFyQixHQUFBO0FBQ25CO0FBQUE7Ozs7Ozs7Ozs7O09BQUE7V0FZQSxJQUFJLENBQUMsZUFDSCxDQUFDLEVBQUUsQ0FBQyxNQUROLENBQ2EsTUFEYixFQUNxQixLQURyQixFQUM0QjtNQUN4QjtBQUFBLFFBQ0UsUUFBQSxFQUFVLElBRFo7T0FEd0IsRUFJeEI7QUFBQSxRQUNFLFlBQUEsRUFBYyxZQURoQjtBQUFBLFFBRUUsU0FBQSxFQUFXLFNBRmI7T0FKd0I7S0FENUIsRUFibUI7RUFBQSxDQTlDckIsQ0FBQTs7QUFBQSx3QkFzRUEsbUJBQUEsR0FBcUIsU0FBQyxJQUFELEdBQUE7QUFDbkI7QUFBQTs7OztPQUFBO1dBS0EsSUFBSSxDQUFDLGVBQ0gsQ0FBQyxFQUFFLENBQUMsTUFETixDQUNhLE1BRGIsRUFDcUIsS0FEckIsRUFDNEI7TUFDeEI7QUFBQSxRQUNFLFFBQUEsRUFBVSxJQURaO09BRHdCO0tBRDVCLEVBTm1CO0VBQUEsQ0F0RXJCLENBQUE7O0FBQUEsd0JBbUZBLG9CQUFBLEdBQXNCLFNBQUEsR0FBQTtXQUNwQixJQUFJLENBQUMsZUFDSCxDQUFDLEVBQUUsQ0FBQyxNQUROLENBQ2EsWUFEYixFQUMyQixNQUQzQixFQUNtQyxFQURuQyxFQURvQjtFQUFBLENBbkZ0QixDQUFBOztBQUFBLHdCQXVGQSxXQUFBLEdBQWEsU0FBQyxRQUFELEdBQUE7QUFDWDtBQUFBOzs7O09BQUE7V0FLQSxJQUFJLENBQUMsZUFDSCxDQUFDLEVBQUUsQ0FBQyxNQUROLENBQ2EsTUFEYixFQUNxQixRQURyQixFQUMrQjtNQUMzQjtBQUFBLFFBQ0UsUUFBQSxFQUFVLFFBRFo7T0FEMkI7S0FEL0IsRUFOVztFQUFBLENBdkZiLENBQUE7O0FBQUEsd0JBb0dBLGdCQUFBLEdBQWtCLFNBQUMsU0FBRCxHQUFBO0FBQ2hCLFdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FDTDtBQUFBLE1BQUEsU0FBQSxFQUFXLFNBQVg7S0FESyxDQUFQLENBRGdCO0VBQUEsQ0FwR2xCLENBQUE7O0FBQUEsd0JBeUdBLGFBQUEsR0FBZSxTQUFDLFFBQUQsR0FBQTtBQUNiLFdBQU8sSUFBSSxDQUFDLFNBQUwsQ0FDTDtBQUFBLE1BQUEsUUFBQSxFQUFVLFFBQVY7S0FESyxDQUFQLENBRGE7RUFBQSxDQXpHZixDQUFBOztBQUFBLHdCQThHQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7V0FDVCxJQUFJLENBQUMsZUFDSCxDQUFDLEVBQUUsQ0FBQyxNQUROLENBQ2EsWUFEYixFQUMyQixNQUQzQixFQUNtQyxDQUFDLElBQUQsQ0FEbkMsRUFEUztFQUFBLENBOUdYLENBQUE7O0FBQUEsd0JBa0hBLFdBQUEsR0FBYSxTQUFBLEdBQUE7V0FDWCxJQUFJLENBQUMsZUFDSCxDQUFDLEVBQUUsQ0FBQyxNQUROLENBQ2EsVUFEYixFQUN5QixNQUR6QixFQUNpQyxFQURqQyxFQURXO0VBQUEsQ0FsSGIsQ0FBQTs7cUJBQUE7O0lBVkYsQ0FBQTs7QUFBQSxNQWdJTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsU0FBQSxFQUFXLFNBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsV0FBckIsR0FBQTtXQUNMLElBQUEsV0FBQSxDQUFZLFFBQVosRUFBc0IsUUFBdEIsRUFBZ0MsV0FBaEMsRUFESztFQUFBLENBQVg7Q0FqSUYsQ0FBQSIsImZpbGUiOiJmbGVldC9pbmRleC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMjIypcbkBtb2R1bGUgam91a291LWNvbmR1Y3Rvci9mbGVldC9pbmRleFxuQGF1dGhvciBGYWJpYW4gQ29vayA8ZmFiaWFuLmNvb2tAam91a291LmNvbT5cbkBjb3B5cmlnaHQgKGMpIDIwMDktMjAxNCBKb3Vrb3UgTHRkLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuIyMjXG5cblEgICAgICAgICA9IHJlcXVpcmUoXCJxXCIpXG5kaXNjb3ZlcnkgPSByZXF1aXJlKFwiLi9kaXNjb3ZlcnkvY2xpZW50XCIpXG5cbmNsYXNzIEZsZWV0Q2xpZW50XG4gICMjIypcbiAgQHR5cGUge0Rpc2NvdmVyeUNsaWVudH1cbiAgIyMjXG4gIGRpc2NvdmVyeUNsaWVudDogbnVsbFxuICBjb25zdHJ1Y3RvcjogKGVuZHBvaW50LCBiYXNlUGF0aCwgZG9EaXNjb3ZlcnkpIC0+XG4gICAgdGhpcy5kaXNjb3ZlcnlDbGllbnQgPSBkaXNjb3ZlcnkuZ2V0Q2xpZW50KGVuZHBvaW50LCBiYXNlUGF0aCwgZmFsc2UpXG4gICAgaWYgZG9EaXNjb3ZlcnlcbiAgICAgIHRoaXMuZGlzY292ZXJ5Q2xpZW50LmRvRGlzY292ZXJ5KClcbiAgICByZXR1cm4gdGhpc1xuICAjIGh0dHBzOi8vZ2l0aHViLmNvbS9jb3Jlb3MvZmxlZXQvYmxvYi9tYXN0ZXIvRG9jdW1lbnRhdGlvbi9hcGktdjEtYWxwaGEubWQjY3JlYXRlLWEtdW5pdFxuICBjcmVhdGVVbml0OiAobmFtZSwgb3B0aW9ucywgZGVzaXJlZFN0YXRlLCBjdXJyZW50U3RhdGUsIG1hY2hpbmVJRCkgLT5cbiAgICAjIyNcbiAgICAgIHBhcmFtZXRlcnM6XG4gICAgICAgIHVuaXROYW1lOiBzdHJpbmdcbiAgICAgICAgICByZXF1aXJlZFxuICAgICAgcmVxdWVzdDpcbiAgICAgICAgJHJlZjogVW5pdFxuICAgICAgICBzY2hlbWE6IG9iamVjdFxuICAgICAgICAgIHByb3BlcnRpZXM6XG4gICAgICAgICAgICBuYW1lOnN0cmluZ1xuICAgICAgICAgICAgb3B0aW9uczogYXJyYXlcbiAgICAgICAgICAgICAgaXRlbXM6XG4gICAgICAgICAgICAgICAgJHJlZjogVW5pdE9wdGlvbnNcbiAgICAgICAgICAgICAgICBzY2hlbWE6XG4gICAgICAgICAgICAgICAgICBzZWN0aW9uOiBzdHJpbmdcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IHN0cmluZ1xuICAgICAgICAgICAgZGVzaXJlZFN0YXRlOiBzdHJpbmdcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZTogc3RyaW5nXG4gICAgICAgICAgICBtYWNoaW5lSUQ6IHN0cmluZ1xuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICMjI1xuICAgIHRoaXMuZGlzY292ZXJ5Q2xpZW50XG4gICAgICAub24ubWV0aG9kKFwiVW5pdFwiLCBcIlNldFwiLCBbXG4gICAgICAgIHtcbiAgICAgICAgdW5pdE5hbWU6IG5hbWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgICAgZGVzaXJlZFN0YXRlOiBkZXNpcmVkU3RhdGVcbiAgICAgICAgICBjdXJyZW50U3RhdGU6IGN1cnJlbnRTdGF0ZVxuICAgICAgICAgIG1hY2hpbmVJRDogbWFjaGluZUlEXG4gICAgICAgIH1cbiAgICAgIF0pXG4gICMgaHR0cHM6Ly9naXRodWIuY29tL2NvcmVvcy9mbGVldC9ibG9iL21hc3Rlci9Eb2N1bWVudGF0aW9uL2FwaS12MS1hbHBoYS5tZCNtb2RpZnktZGVzaXJlZC1zdGF0ZS1vZi1hLXVuaXRcbiAgc2V0VW5pdERlc2lyZWRTdGF0ZTogKG5hbWUsIGRlc2lyZWRTdGF0ZSwgbWFjaGluZUlEKSAtPlxuICAgICMjI1xuICAgICAgcGFyYW1ldGVyczpcbiAgICAgICAgdW5pdE5hbWU6IHN0cmluZ1xuICAgICAgICAgIHJlcXVpcmVkXG4gICAgICByZXF1ZXN0OlxuICAgICAgICAkcmVmOiBVbml0XG4gICAgICAgIHNjaGVtYTogb2JqZWN0XG4gICAgICAgICAgcHJvcGVydGllczpcbiAgICAgICAgICAgIGRlc2lyZWRTdGF0ZTogc3RyaW5nXG4gICAgICAgICAgICBtYWNoaW5lSUQ6IHN0cmluZ1xuICAgICAgICAgICAgICByZXF1aXJlZFxuICAgICMjI1xuICAgIHRoaXMuZGlzY292ZXJ5Q2xpZW50XG4gICAgICAub24ubWV0aG9kKFwiVW5pdFwiLCBcIlNldFwiLCBbXG4gICAgICAgIHtcbiAgICAgICAgICB1bml0TmFtZTogbmFtZVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZGVzaXJlZFN0YXRlOiBkZXNpcmVkU3RhdGVcbiAgICAgICAgICBtYWNoaW5lSUQ6IG1hY2hpbmVJRFxuICAgICAgICB9XG4gICAgICBdKVxuICAjIGh0dHBzOi8vZ2l0aHViLmNvbS9jb3Jlb3MvZmxlZXQvYmxvYi9tYXN0ZXIvRG9jdW1lbnRhdGlvbi9hcGktdjEtYWxwaGEubWQjcmV0cmlldmUtZGVzaXJlZC1zdGF0ZS1vZi1hLXNwZWNpZmljLXVuaXRcbiAgZ2V0VW5pdERlc2lyZWRTdGF0ZTogKG5hbWUpIC0+XG4gICAgIyMjXG4gICAgICBwYXJhbWV0ZXJzOlxuICAgICAgICB1bml0TmFtZTogc3RyaW5nXG4gICAgICAgICAgcmVxdWlyZWRcbiAgICAjIyNcbiAgICB0aGlzLmRpc2NvdmVyeUNsaWVudFxuICAgICAgLm9uLm1ldGhvZChcIlVuaXRcIiwgXCJHZXRcIiwgW1xuICAgICAgICB7XG4gICAgICAgICAgdW5pdE5hbWU6IG5hbWVcbiAgICAgICAgfVxuICAgICAgXSlcbiAgIyBodHRwczovL2dpdGh1Yi5jb20vY29yZW9zL2ZsZWV0L2Jsb2IvbWFzdGVyL0RvY3VtZW50YXRpb24vYXBpLXYxLWFscGhhLm1kI3JldHJpZXZlLWRlc2lyZWQtc3RhdGUtb2YtYWxsLXVuaXRzXG4gIGdldFVuaXREZXNpcmVkU3RhdGVzOiAtPlxuICAgIHRoaXMuZGlzY292ZXJ5Q2xpZW50XG4gICAgICAub24ubWV0aG9kKFwiVW5pdFN0YXRlc1wiLCBcIkxpc3RcIiwgW10pXG4gICMgaHR0cHM6Ly9naXRodWIuY29tL2NvcmVvcy9mbGVldC9ibG9iL21hc3Rlci9Eb2N1bWVudGF0aW9uL2FwaS12MS1hbHBoYS5tZCNkZXN0cm95LWEtdW5pdFxuICBkZXN0cm95VW5pdDogKHVuaXROYW1lKSAtPlxuICAgICMjI1xuICAgICAgcGFyYW1ldGVyczpcbiAgICAgICAgdW5pdE5hbWU6IHN0cmluZ1xuICAgICAgICAgIHJlcXVpcmVkXG4gICAgIyMjXG4gICAgdGhpcy5kaXNjb3ZlcnlDbGllbnRcbiAgICAgIC5vbi5tZXRob2QoXCJVbml0XCIsIFwiRGVsZXRlXCIsIFtcbiAgICAgICAge1xuICAgICAgICAgIHVuaXROYW1lOiB1bml0TmFtZVxuICAgICAgICB9XG4gICAgICBdKVxuICAjIGh0dHBzOi8vZ2l0aHViLmNvbS9jb3Jlb3MvZmxlZXQvYmxvYi9tYXN0ZXIvRG9jdW1lbnRhdGlvbi9hcGktdjEtYWxwaGEubWQjcmV0cmlldmUtY3VycmVudC1zdGF0ZS1vZi1hbGwtdW5pdHNcbiAgZ2V0TWFjaGluZVN0YXRlczogKG1hY2hpbmVJRCkgLT5cbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZXMoXG4gICAgICBtYWNoaW5lSUQ6IG1hY2hpbmVJRFxuICAgIClcbiAgIyBodHRwczovL2dpdGh1Yi5jb20vY29yZW9zL2ZsZWV0L2Jsb2IvbWFzdGVyL0RvY3VtZW50YXRpb24vYXBpLXYxLWFscGhhLm1kI3JldHJpZXZlLWN1cnJlbnQtc3RhdGUtb2YtYWxsLXVuaXRzXG4gIGdldFVuaXRTdGF0ZXM6ICh1bml0TmFtZSkgLT5cbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZXMoXG4gICAgICB1bml0TmFtZTogdW5pdE5hbWVcbiAgICApXG4gICMgaHR0cHM6Ly9naXRodWIuY29tL2NvcmVvcy9mbGVldC9ibG9iL21hc3Rlci9Eb2N1bWVudGF0aW9uL2FwaS12MS1hbHBoYS5tZCNyZXRyaWV2ZS1jdXJyZW50LXN0YXRlLW9mLWFsbC11bml0c1xuICBnZXRTdGF0ZXM6IChvcHRzKSAtPlxuICAgIHRoaXMuZGlzY292ZXJ5Q2xpZW50XG4gICAgICAub24ubWV0aG9kKFwiVW5pdFN0YXRlc1wiLCBcIkxpc3RcIiwgW29wdHNdKVxuICAjIGh0dHBzOi8vZ2l0aHViLmNvbS9jb3Jlb3MvZmxlZXQvYmxvYi9tYXN0ZXIvRG9jdW1lbnRhdGlvbi9hcGktdjEtYWxwaGEubWQjbGlzdC1tYWNoaW5lc1xuICBnZXRNYWNoaW5lczogLT5cbiAgICB0aGlzLmRpc2NvdmVyeUNsaWVudFxuICAgICAgLm9uLm1ldGhvZChcIk1hY2hpbmVzXCIsIFwiTGlzdFwiLCBbXSlcblxubW9kdWxlLmV4cG9ydHMgPVxuICBnZXRDbGllbnQ6IChlbmRwb2ludCwgYmFzZVBhdGgsIGRvRGlzY292ZXJ5KSAtPlxuICAgIG5ldyBGbGVldENsaWVudChlbmRwb2ludCwgYmFzZVBhdGgsIGRvRGlzY292ZXJ5KSJdfQ==
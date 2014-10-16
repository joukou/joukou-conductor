var Section, SystemDInstall,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Section = require("./section");

SystemDInstall = (function(_super) {
  __extends(SystemDInstall, _super);

  function SystemDInstall() {
    SystemDInstall.__super__.constructor.call(this, "Install");
  }

  SystemDInstall.prototype.addAlias = function(value) {
    return this.addPair("Alias", value);
  };

  SystemDInstall.prototype.addWantedBy = function(value) {
    return this.addPair("WantedBy", value);
  };

  SystemDInstall.prototype.addRequiredBy = function(value) {
    return this.addPair("RequiredBy", value);
  };

  SystemDInstall.prototype.addAlso = function(value) {
    return this.addPair("Also", value);
  };

  SystemDInstall.prototype.addDefaultInstance = function(value) {
    return this.addPair("DefaultInstance", value);
  };

  return SystemDInstall;

})(Section);

module.exports = SystemDInstall;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN5c3RlbWQvaW5zdGFsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSx1QkFBQTtFQUFBO2lTQUFBOztBQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUFWLENBQUE7O0FBQUE7QUFHRSxtQ0FBQSxDQUFBOztBQUFhLEVBQUEsd0JBQUEsR0FBQTtBQUNYLElBQUEsZ0RBQU0sU0FBTixDQUFBLENBRFc7RUFBQSxDQUFiOztBQUFBLDJCQUlBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtXQUNSLElBQUMsQ0FBQSxPQUFELENBQVMsT0FBVCxFQUFrQixLQUFsQixFQURRO0VBQUEsQ0FKVixDQUFBOztBQUFBLDJCQVFBLFdBQUEsR0FBYSxTQUFDLEtBQUQsR0FBQTtXQUNYLElBQUMsQ0FBQSxPQUFELENBQVMsVUFBVCxFQUFxQixLQUFyQixFQURXO0VBQUEsQ0FSYixDQUFBOztBQUFBLDJCQVlBLGFBQUEsR0FBZSxTQUFDLEtBQUQsR0FBQTtXQUNiLElBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixLQUF2QixFQURhO0VBQUEsQ0FaZixDQUFBOztBQUFBLDJCQWdCQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7V0FDUCxJQUFDLENBQUEsT0FBRCxDQUFTLE1BQVQsRUFBaUIsS0FBakIsRUFETztFQUFBLENBaEJULENBQUE7O0FBQUEsMkJBb0JBLGtCQUFBLEdBQW9CLFNBQUMsS0FBRCxHQUFBO1dBQ2xCLElBQUMsQ0FBQSxPQUFELENBQVMsaUJBQVQsRUFBNEIsS0FBNUIsRUFEa0I7RUFBQSxDQXBCcEIsQ0FBQTs7d0JBQUE7O0dBRDJCLFFBRjdCLENBQUE7O0FBQUEsTUEwQk0sQ0FBQyxPQUFQLEdBQWlCLGNBMUJqQixDQUFBIiwiZmlsZSI6InN5c3RlbWQvaW5zdGFsbC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIlNlY3Rpb24gPSByZXF1aXJlKFwiLi9zZWN0aW9uXCIpXG5cbmNsYXNzIFN5c3RlbURJbnN0YWxsIGV4dGVuZHMgU2VjdGlvblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBzdXBlcihcIkluc3RhbGxcIilcblxuICAjIGh0dHA6Ly8wcG9pbnRlci5kZS9wdWJsaWMvc3lzdGVtZC1tYW4vc3lzdGVtZC51bml0Lmh0bWwjQWxpYXM9XG4gIGFkZEFsaWFzOiAodmFsdWUpIC0+XG4gICAgQGFkZFBhaXIoXCJBbGlhc1wiLCB2YWx1ZSlcblxuICAjIGh0dHA6Ly8wcG9pbnRlci5kZS9wdWJsaWMvc3lzdGVtZC1tYW4vc3lzdGVtZC51bml0Lmh0bWwjV2FudGVkQnk9XG4gIGFkZFdhbnRlZEJ5OiAodmFsdWUpIC0+XG4gICAgQGFkZFBhaXIoXCJXYW50ZWRCeVwiLCB2YWx1ZSlcblxuICAjIGh0dHA6Ly8wcG9pbnRlci5kZS9wdWJsaWMvc3lzdGVtZC1tYW4vc3lzdGVtZC51bml0Lmh0bWwjV2FudGVkQnk9XG4gIGFkZFJlcXVpcmVkQnk6ICh2YWx1ZSkgLT5cbiAgICBAYWRkUGFpcihcIlJlcXVpcmVkQnlcIiwgdmFsdWUpXG5cbiAgIyBodHRwOi8vMHBvaW50ZXIuZGUvcHVibGljL3N5c3RlbWQtbWFuL3N5c3RlbWQudW5pdC5odG1sI0Fsc289XG4gIGFkZEFsc286ICh2YWx1ZSkgLT5cbiAgICBAYWRkUGFpcihcIkFsc29cIiwgdmFsdWUpXG5cbiAgIyBodHRwOi8vMHBvaW50ZXIuZGUvcHVibGljL3N5c3RlbWQtbWFuL3N5c3RlbWQudW5pdC5odG1sI0RlZmF1bHRJbnN0YW5jZT1cbiAgYWRkRGVmYXVsdEluc3RhbmNlOiAodmFsdWUpIC0+XG4gICAgQGFkZFBhaXIoXCJEZWZhdWx0SW5zdGFuY2VcIiwgdmFsdWUpXG5cbm1vZHVsZS5leHBvcnRzID0gU3lzdGVtREluc3RhbGwiXX0=
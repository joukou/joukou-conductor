var Common, SystemDUnit,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Common = require("./unit-common");

SystemDUnit = (function(_super) {
  __extends(SystemDUnit, _super);

  function SystemDUnit() {
    SystemDUnit.__super__.constructor.call(this, "Unit");
  }

  return SystemDUnit;

})(Common);

module.exports = SystemDUnit;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN5c3RlbWQvdW5pdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxtQkFBQTtFQUFBO2lTQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQUFULENBQUE7O0FBQUE7QUFHRSxnQ0FBQSxDQUFBOztBQUFhLEVBQUEscUJBQUEsR0FBQTtBQUNYLElBQUEsNkNBQU0sTUFBTixDQUFBLENBRFc7RUFBQSxDQUFiOztxQkFBQTs7R0FEd0IsT0FGMUIsQ0FBQTs7QUFBQSxNQU1NLENBQUMsT0FBUCxHQUFpQixXQU5qQixDQUFBIiwiZmlsZSI6InN5c3RlbWQvdW5pdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIkNvbW1vbiA9IHJlcXVpcmUoXCIuL3VuaXQtY29tbW9uXCIpXG5cbmNsYXNzIFN5c3RlbURVbml0IGV4dGVuZHMgQ29tbW9uXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIHN1cGVyKFwiVW5pdFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN5c3RlbURVbml0Il19
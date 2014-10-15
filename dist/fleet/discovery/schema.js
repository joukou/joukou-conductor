var DiscoverySchema, schema;

schema = require("schemajs");

DiscoverySchema = (function() {
  DiscoverySchema.prototype.id = "";

  DiscoverySchema.prototype.type = "";

  DiscoverySchema.prototype.properties = {};

  DiscoverySchema.prototype.schema = null;

  DiscoverySchema.prototype.schemaOptions = null;

  DiscoverySchema.prototype.client = null;


  /**
  * @param {string} id
  * @param {string} type
  * @param {Object} properties
   */

  function DiscoverySchema(id, type, properties, client) {
    this.id = id;
    this.type = type;
    this.properties = properties;
    this.client = client;
  }

  DiscoverySchema.prototype.validate = function(value) {
    var reason, validation, values;
    if (value === null || value === void 0) {
      return {
        valid: false,
        value: value,
        reason: "Value is null or undefined"
      };
    }
    if (this.type === "string" && typeof value !== string) {
      value = JSON.parse(value);
    }
    if (this._checkType(value, this.type)) {
      return {
        valid: false,
        value: value,
        reason: "Type of value isn't " + this.type
      };
    }
    if (this.type === "object") {
      validation = this._validateSchema(value);
      if (validation.valid) {
        return {
          valid: true,
          value: validation.data
        };
      } else {
        values = _.values(validation.errors);
        reason = "request is not valid";
        if (values.length) {
          reason = values[0];
        }
        return {
          valid: false,
          value: value,
          reason: reason
        };
      }
    } else {
      return {
        valid: true,
        value: value
      };
    }
  };

  DiscoverySchema.prototype._checkType = function(value, type) {
    switch (type) {
      case "array":
        return _.isArray(value);
      case "object":
        return _.isPlainObject(value);
      case "string":
        return _.isString(value);
      case "integer":
        if (!_.isNumber(value)) {
          return false;
        }
        return value === parseInt(value);
      case "number":
        return _.isNumber(value);
      case "boolean":
        return _.isBoolean(value);
      case "any":
        return true;
      default:
        return false;
    }
  };

  DiscoverySchema.prototype._validateSchema = function(value) {
    this._generateSchema();
    return this.schema.validate(value);
  };

  DiscoverySchema.prototype._generateSchema = function() {
    if (!schema.types.any) {
      schema.types.any = function() {
        return true;
      };
    }
    return this.schema = this.schema || schema.create(this._generateSchemaOptions());
  };

  DiscoverySchema.prototype._generateSchemaOptions = function() {
    var key, options, property, ref, type, _i, _len, _ref;
    if (this.schemaOptions) {
      return this.schemaOptions;
    }
    options = {};
    _ref = this.properties;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (!this.properties.hasOwnProperty(key)) {
        continue;
      }
      property = this.properties[key];
      if (property.type === "array") {
        options[key] = {
          type: "array",
          required: !!property.required
        };
        if (!(property.items instanceof Object)) {
          continue;
        }
        if (!property.items.$ref) {
          continue;
        }
        ref = property.items.$ref;
        schema = this.client.getSchema(ref);
        if (!schema || schema === this) {
          continue;
        }
        options[key].schema = this.client.getSchema(ref)._generateSchemaOptions();
      } else if (property.type === "object") {
        options[key] = {
          type: "object",
          required: !!property.required
        };
        if (!property.$ref) {
          continue;
        }
        ref = property.$ref;
        schema = this.client.getSchema(ref);
        if (!schema || schema === this) {
          continue;
        }
        options[key].schema = this.client.getSchema(ref)._generateSchemaOptions();
      } else {
        type = null;
        if (property.type === "integer") {
          type = "int";
        } else {
          type = property.type;
        }
        options[key] = {
          type: type,
          required: !!property.required
        };
      }
    }
    return this.schemaOptions = options;
  };

  return DiscoverySchema;

})();

module.exports = DiscoverySchema;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsZWV0L2Rpc2NvdmVyeS9zY2hlbWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsdUJBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQTtBQUdFLDRCQUFBLEVBQUEsR0FBSSxFQUFKLENBQUE7O0FBQUEsNEJBQ0EsSUFBQSxHQUFNLEVBRE4sQ0FBQTs7QUFBQSw0QkFFQSxVQUFBLEdBQVksRUFGWixDQUFBOztBQUFBLDRCQUdBLE1BQUEsR0FBUSxJQUhSLENBQUE7O0FBQUEsNEJBSUEsYUFBQSxHQUFlLElBSmYsQ0FBQTs7QUFBQSw0QkFLQSxNQUFBLEdBQVEsSUFMUixDQUFBOztBQU1BO0FBQUE7Ozs7S0FOQTs7QUFXYSxFQUFBLHlCQUFDLEVBQUQsRUFBSyxJQUFMLEVBQVcsVUFBWCxFQUF1QixNQUF2QixHQUFBO0FBQ1gsSUFBQSxJQUFJLENBQUMsRUFBTCxHQUFVLEVBQVYsQ0FBQTtBQUFBLElBQ0EsSUFBSSxDQUFDLElBQUwsR0FBWSxJQURaLENBQUE7QUFBQSxJQUVBLElBQUksQ0FBQyxVQUFMLEdBQWtCLFVBRmxCLENBQUE7QUFBQSxJQUdBLElBQUksQ0FBQyxNQUFMLEdBQWMsTUFIZCxDQURXO0VBQUEsQ0FYYjs7QUFBQSw0QkFnQkEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsUUFBQSwwQkFBQTtBQUFBLElBQUEsSUFBRyxLQUFBLEtBQVMsSUFBVCxJQUFpQixLQUFBLEtBQVMsTUFBN0I7QUFDRSxhQUFPO0FBQUEsUUFDTCxLQUFBLEVBQU8sS0FERjtBQUFBLFFBRUwsS0FBQSxFQUFPLEtBRkY7QUFBQSxRQUdMLE1BQUEsRUFBUSw0QkFISDtPQUFQLENBREY7S0FBQTtBQU1BLElBQUEsSUFBRyxJQUFJLENBQUMsSUFBTCxLQUFhLFFBQWIsSUFBMEIsTUFBQSxDQUFBLEtBQUEsS0FBa0IsTUFBL0M7QUFDRSxNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsQ0FBUixDQURGO0tBTkE7QUFRQSxJQUFBLElBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsS0FBaEIsRUFBdUIsSUFBSSxDQUFDLElBQTVCLENBQUg7QUFDRSxhQUFPO0FBQUEsUUFDTCxLQUFBLEVBQU8sS0FERjtBQUFBLFFBRUwsS0FBQSxFQUFPLEtBRkY7QUFBQSxRQUdMLE1BQUEsRUFBUyxzQkFBQSxHQUFzQixJQUFJLENBQUMsSUFIL0I7T0FBUCxDQURGO0tBUkE7QUFjQSxJQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxRQUFoQjtBQUNFLE1BQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxlQUFMLENBQXFCLEtBQXJCLENBQWIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxVQUFVLENBQUMsS0FBZDtBQUNFLGVBQU87QUFBQSxVQUNMLEtBQUEsRUFBTyxJQURGO0FBQUEsVUFFTCxLQUFBLEVBQU8sVUFBVSxDQUFDLElBRmI7U0FBUCxDQURGO09BQUEsTUFBQTtBQU1FLFFBQUEsTUFBQSxHQUFTLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVSxDQUFDLE1BQXBCLENBQVQsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLHNCQURULENBQUE7QUFFQSxRQUFBLElBQUcsTUFBTSxDQUFDLE1BQVY7QUFDRSxVQUFBLE1BQUEsR0FBUyxNQUFPLENBQUEsQ0FBQSxDQUFoQixDQURGO1NBRkE7QUFJQSxlQUFPO0FBQUEsVUFDTCxLQUFBLEVBQU8sS0FERjtBQUFBLFVBRUwsS0FBQSxFQUFPLEtBRkY7QUFBQSxVQUdMLE1BQUEsRUFBUSxNQUhIO1NBQVAsQ0FWRjtPQUZGO0tBQUEsTUFBQTtBQWtCRSxhQUFPO0FBQUEsUUFDTCxLQUFBLEVBQU8sSUFERjtBQUFBLFFBRUwsS0FBQSxFQUFPLEtBRkY7T0FBUCxDQWxCRjtLQWZRO0VBQUEsQ0FoQlYsQ0FBQTs7QUFBQSw0QkFxREEsVUFBQSxHQUFZLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUdWLFlBQU8sSUFBUDtBQUFBLFdBQ08sT0FEUDtlQUVJLENBQUMsQ0FBQyxPQUFGLENBQVcsS0FBWCxFQUZKO0FBQUEsV0FHTyxRQUhQO2VBSUksQ0FBQyxDQUFDLGFBQUYsQ0FBaUIsS0FBakIsRUFKSjtBQUFBLFdBS08sUUFMUDtlQU1JLENBQUMsQ0FBQyxRQUFGLENBQVksS0FBWixFQU5KO0FBQUEsV0FPTyxTQVBQO0FBUUksUUFBQSxJQUFnQixDQUFBLENBQUssQ0FBQyxRQUFGLENBQVksS0FBWixDQUFwQjtBQUFBLGlCQUFPLEtBQVAsQ0FBQTtTQUFBO2VBQ0EsS0FBQSxLQUFTLFFBQUEsQ0FBVSxLQUFWLEVBVGI7QUFBQSxXQVVPLFFBVlA7ZUFXSSxDQUFDLENBQUMsUUFBRixDQUFXLEtBQVgsRUFYSjtBQUFBLFdBWU8sU0FaUDtlQWFJLENBQUMsQ0FBQyxTQUFGLENBQVksS0FBWixFQWJKO0FBQUEsV0FjTyxLQWRQO2VBZUksS0FmSjtBQUFBO2VBaUJJLE1BakJKO0FBQUEsS0FIVTtFQUFBLENBckRaLENBQUE7O0FBQUEsNEJBMEVBLGVBQUEsR0FBaUIsU0FBQyxLQUFELEdBQUE7QUFDZixJQUFBLElBQUksQ0FBQyxlQUFMLENBQUEsQ0FBQSxDQUFBO0FBQ0EsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVosQ0FBcUIsS0FBckIsQ0FBUCxDQUZlO0VBQUEsQ0ExRWpCLENBQUE7O0FBQUEsNEJBNkVBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsSUFBQSxJQUFHLENBQUEsTUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFwQjtBQUNFLE1BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFiLEdBQW1CLFNBQUEsR0FBQTtlQUNqQixLQURpQjtNQUFBLENBQW5CLENBREY7S0FBQTtXQUdBLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQUwsSUFBZSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQUksQ0FBQyxzQkFBTCxDQUFBLENBQWQsRUFKZDtFQUFBLENBN0VqQixDQUFBOztBQUFBLDRCQWtGQSxzQkFBQSxHQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSxpREFBQTtBQUFBLElBQUEsSUFBRyxJQUFJLENBQUMsYUFBUjtBQUNFLGFBQU8sSUFBSSxDQUFDLGFBQVosQ0FERjtLQUFBO0FBQUEsSUFFQSxPQUFBLEdBQVUsRUFGVixDQUFBO0FBR0E7QUFBQSxTQUFBLDJDQUFBO3FCQUFBO0FBQ0UsTUFBQSxJQUFHLENBQUEsSUFBUSxDQUFDLFVBQVUsQ0FBQyxjQUFoQixDQUErQixHQUEvQixDQUFQO0FBQ0UsaUJBREY7T0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLElBQUksQ0FBQyxVQUFXLENBQUEsR0FBQSxDQUYzQixDQUFBO0FBR0EsTUFBQSxJQUFHLFFBQVEsQ0FBQyxJQUFULEtBQWlCLE9BQXBCO0FBQ0UsUUFBQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWU7QUFBQSxVQUNiLElBQUEsRUFBTSxPQURPO0FBQUEsVUFFYixRQUFBLEVBQVUsQ0FBQSxDQUFDLFFBQVMsQ0FBQyxRQUZSO1NBQWYsQ0FBQTtBQUlBLFFBQUEsSUFBRyxDQUFBLENBQUEsUUFBUSxDQUFDLEtBQVQsWUFBOEIsTUFBOUIsQ0FBSDtBQUNFLG1CQURGO1NBSkE7QUFNQSxRQUFBLElBQUcsQ0FBQSxRQUFZLENBQUMsS0FBSyxDQUFDLElBQXRCO0FBR0UsbUJBSEY7U0FOQTtBQUFBLFFBVUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFWckIsQ0FBQTtBQUFBLFFBV0EsTUFBQSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBWixDQUFzQixHQUF0QixDQVhULENBQUE7QUFhQSxRQUFBLElBQUcsQ0FBQSxNQUFBLElBQWMsTUFBQSxLQUFVLElBQTNCO0FBQ0UsbUJBREY7U0FiQTtBQUFBLFFBZUEsT0FBUSxDQUFBLEdBQUEsQ0FBSSxDQUFDLE1BQWIsR0FBc0IsSUFDcEIsQ0FBQyxNQUNELENBQUMsU0FGbUIsQ0FFVCxHQUZTLENBR3BCLENBQUMsc0JBSG1CLENBQUEsQ0FmdEIsQ0FERjtPQUFBLE1Bb0JLLElBQUcsUUFBUSxDQUFDLElBQVQsS0FBaUIsUUFBcEI7QUFDSCxRQUFBLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZTtBQUFBLFVBQ2IsSUFBQSxFQUFNLFFBRE87QUFBQSxVQUViLFFBQUEsRUFBVSxDQUFBLENBQUMsUUFBUyxDQUFDLFFBRlI7U0FBZixDQUFBO0FBSUEsUUFBQSxJQUFHLENBQUEsUUFBWSxDQUFDLElBQWhCO0FBRUUsbUJBRkY7U0FKQTtBQUFBLFFBT0EsR0FBQSxHQUFNLFFBQVEsQ0FBQyxJQVBmLENBQUE7QUFBQSxRQVFBLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsR0FBdEIsQ0FSVCxDQUFBO0FBVUEsUUFBQSxJQUFHLENBQUEsTUFBQSxJQUFjLE1BQUEsS0FBVSxJQUEzQjtBQUNFLG1CQURGO1NBVkE7QUFBQSxRQVlBLE9BQVEsQ0FBQSxHQUFBLENBQUksQ0FBQyxNQUFiLEdBQXNCLElBQ3BCLENBQUMsTUFDRCxDQUFDLFNBRm1CLENBRVQsR0FGUyxDQUdwQixDQUFDLHNCQUhtQixDQUFBLENBWnRCLENBREc7T0FBQSxNQUFBO0FBa0JILFFBQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUlBLFFBQUEsSUFBRyxRQUFRLENBQUMsSUFBVCxLQUFpQixTQUFwQjtBQUNFLFVBQUEsSUFBQSxHQUFPLEtBQVAsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsSUFBaEIsQ0FIRjtTQUpBO0FBQUEsUUFRQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWU7QUFBQSxVQUNiLElBQUEsRUFBTSxJQURPO0FBQUEsVUFFYixRQUFBLEVBQVUsQ0FBQSxDQUFDLFFBQVMsQ0FBQyxRQUZSO1NBUmYsQ0FsQkc7T0F4QlA7QUFBQSxLQUhBO1dBeURBLElBQUksQ0FBQyxhQUFMLEdBQXFCLFFBMURDO0VBQUEsQ0FsRnhCLENBQUE7O3lCQUFBOztJQUhGLENBQUE7O0FBQUEsTUFpSk0sQ0FBQyxPQUFQLEdBQWlCLGVBakpqQixDQUFBIiwiZmlsZSI6ImZsZWV0L2Rpc2NvdmVyeS9zY2hlbWEuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJzY2hlbWEgPSByZXF1aXJlKFwic2NoZW1hanNcIilcblxuY2xhc3MgRGlzY292ZXJ5U2NoZW1hXG4gIGlkOiBcIlwiXG4gIHR5cGU6IFwiXCJcbiAgcHJvcGVydGllczoge31cbiAgc2NoZW1hOiBudWxsXG4gIHNjaGVtYU9wdGlvbnM6IG51bGxcbiAgY2xpZW50OiBudWxsXG4gICMjIypcbiAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogKGlkLCB0eXBlLCBwcm9wZXJ0aWVzLCBjbGllbnQpIC0+XG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudFxuICB2YWxpZGF0ZTogKHZhbHVlKSAtPlxuICAgIGlmIHZhbHVlIGlzIG51bGwgb3IgdmFsdWUgaXMgdW5kZWZpbmVkXG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2VcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIHJlYXNvbjogXCJWYWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZFwiXG4gICAgICB9XG4gICAgaWYgdGhpcy50eXBlIGlzIFwic3RyaW5nXCIgYW5kIHR5cGVvZiB2YWx1ZSBpc250IHN0cmluZ1xuICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKVxuICAgIGlmIHRoaXMuX2NoZWNrVHlwZSh2YWx1ZSwgdGhpcy50eXBlKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICByZWFzb246IFwiVHlwZSBvZiB2YWx1ZSBpc24ndCAje3RoaXMudHlwZX1cIlxuICAgICAgfVxuICAgIGlmIHRoaXMudHlwZSBpcyBcIm9iamVjdFwiXG4gICAgICB2YWxpZGF0aW9uID0gdGhpcy5fdmFsaWRhdGVTY2hlbWEodmFsdWUpXG4gICAgICBpZiB2YWxpZGF0aW9uLnZhbGlkXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsaWQ6IHRydWVcbiAgICAgICAgICB2YWx1ZTogdmFsaWRhdGlvbi5kYXRhXG4gICAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWVzID0gXy52YWx1ZXModmFsaWRhdGlvbi5lcnJvcnMpXG4gICAgICAgIHJlYXNvbiA9IFwicmVxdWVzdCBpcyBub3QgdmFsaWRcIlxuICAgICAgICBpZiB2YWx1ZXMubGVuZ3RoXG4gICAgICAgICAgcmVhc29uID0gdmFsdWVzWzBdXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsaWQ6IGZhbHNlXG4gICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgfVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkOiB0cnVlXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfVxuICBfY2hlY2tUeXBlOiAodmFsdWUsIHR5cGUpIC0+XG4gICAgIyBWYWxpZCB0eXBlc1xuICAgICMgaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvZHJhZnQtenlwLWpzb24tc2NoZW1hLTAzI3NlY3Rpb24tNS4xXG4gICAgc3dpdGNoIHR5cGVcbiAgICAgIHdoZW4gXCJhcnJheVwiXG4gICAgICAgIF8uaXNBcnJheSggdmFsdWUgKVxuICAgICAgd2hlbiBcIm9iamVjdFwiXG4gICAgICAgIF8uaXNQbGFpbk9iamVjdCggdmFsdWUgKVxuICAgICAgd2hlbiBcInN0cmluZ1wiXG4gICAgICAgIF8uaXNTdHJpbmcoIHZhbHVlIClcbiAgICAgIHdoZW4gXCJpbnRlZ2VyXCJcbiAgICAgICAgcmV0dXJuIGZhbHNlIGlmIG5vdCBfLmlzTnVtYmVyKCB2YWx1ZSApXG4gICAgICAgIHZhbHVlIGlzIHBhcnNlSW50KCB2YWx1ZSApXG4gICAgICB3aGVuIFwibnVtYmVyXCJcbiAgICAgICAgXy5pc051bWJlcih2YWx1ZSlcbiAgICAgIHdoZW4gXCJib29sZWFuXCJcbiAgICAgICAgXy5pc0Jvb2xlYW4odmFsdWUpXG4gICAgICB3aGVuIFwiYW55XCJcbiAgICAgICAgdHJ1ZVxuICAgICAgZWxzZVxuICAgICAgICBmYWxzZVxuICBfdmFsaWRhdGVTY2hlbWE6ICh2YWx1ZSkgLT5cbiAgICB0aGlzLl9nZW5lcmF0ZVNjaGVtYSgpXG4gICAgcmV0dXJuIHRoaXMuc2NoZW1hLnZhbGlkYXRlKHZhbHVlKVxuICBfZ2VuZXJhdGVTY2hlbWE6IC0+XG4gICAgaWYgbm90IHNjaGVtYS50eXBlcy5hbnlcbiAgICAgIHNjaGVtYS50eXBlcy5hbnkgPSAtPlxuICAgICAgICB0cnVlXG4gICAgdGhpcy5zY2hlbWEgPSB0aGlzLnNjaGVtYSBvciBzY2hlbWEuY3JlYXRlKHRoaXMuX2dlbmVyYXRlU2NoZW1hT3B0aW9ucygpKVxuICBfZ2VuZXJhdGVTY2hlbWFPcHRpb25zOiAtPlxuICAgIGlmIHRoaXMuc2NoZW1hT3B0aW9uc1xuICAgICAgcmV0dXJuIHRoaXMuc2NoZW1hT3B0aW9uc1xuICAgIG9wdGlvbnMgPSB7fVxuICAgIGZvciBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzXG4gICAgICBpZiBub3QgdGhpcy5wcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgY29udGludWVcbiAgICAgIHByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0aWVzW2tleV1cbiAgICAgIGlmIHByb3BlcnR5LnR5cGUgaXMgXCJhcnJheVwiXG4gICAgICAgIG9wdGlvbnNba2V5XSA9IHtcbiAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgcmVxdWlyZWQ6ICEhcHJvcGVydHkucmVxdWlyZWRcbiAgICAgICAgfVxuICAgICAgICBpZiBwcm9wZXJ0eS5pdGVtcyBub3QgaW5zdGFuY2VvZiBPYmplY3RcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICBpZiBub3QgcHJvcGVydHkuaXRlbXMuJHJlZlxuICAgICAgICAgICMgVE9ETyBpbXBsZW1lbnQgb3RoZXIgdGhhbiAkcmVmXG4gICAgICAgICAgIyBGbGVldCBBUEkgb25seSB1c2VzICRyZWYgY3VycmVudGx5XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgcmVmID0gcHJvcGVydHkuaXRlbXMuJHJlZlxuICAgICAgICBzY2hlbWEgPSB0aGlzLmNsaWVudC5nZXRTY2hlbWEocmVmKVxuICAgICAgICAjIFdlIGRvbid0IHdhbnQgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICAgICAgICBpZiBub3Qgc2NoZW1hIG9yIHNjaGVtYSBpcyB0aGlzXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgb3B0aW9uc1trZXldLnNjaGVtYSA9IHRoaXNcbiAgICAgICAgICAuY2xpZW50XG4gICAgICAgICAgLmdldFNjaGVtYShyZWYpXG4gICAgICAgICAgLl9nZW5lcmF0ZVNjaGVtYU9wdGlvbnMoKVxuICAgICAgZWxzZSBpZiBwcm9wZXJ0eS50eXBlIGlzIFwib2JqZWN0XCJcbiAgICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICAgICAgcmVxdWlyZWQ6ICEhcHJvcGVydHkucmVxdWlyZWRcbiAgICAgICAgfVxuICAgICAgICBpZiBub3QgcHJvcGVydHkuJHJlZlxuICAgICAgICAgICMgVE9ETyBpbXBsZW1lbnQgb3RoZXIgdGhhbiAkcmVmXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgcmVmID0gcHJvcGVydHkuJHJlZlxuICAgICAgICBzY2hlbWEgPSB0aGlzLmNsaWVudC5nZXRTY2hlbWEocmVmKVxuICAgICAgICAjIFdlIGRvbid0IHdhbnQgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICAgICAgICBpZiBub3Qgc2NoZW1hIG9yIHNjaGVtYSBpcyB0aGlzXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgb3B0aW9uc1trZXldLnNjaGVtYSA9IHRoaXNcbiAgICAgICAgICAuY2xpZW50XG4gICAgICAgICAgLmdldFNjaGVtYShyZWYpXG4gICAgICAgICAgLl9nZW5lcmF0ZVNjaGVtYU9wdGlvbnMoKVxuICAgICAgZWxzZVxuICAgICAgICB0eXBlID0gbnVsbFxuICAgICAgICAjIFwiaW50ZWdlclwiIGlzIHRoZSBvbmx5IHR5cGUgdGhhdCBpcyBkaWZmZXJlbnRcbiAgICAgICAgIyBodHRwczovL2dpdGh1Yi5jb20vZWxlaXRoL3NjaGVtYWpzI3NjaGVtYXR5cGVzXG4gICAgICAgICMgSSBoYXZlIGV4dGVuZGVkIHNjaGVtYSB0byBhY2NlcHQgdHlwZSBcImFueVwiXG4gICAgICAgIGlmIHByb3BlcnR5LnR5cGUgaXMgXCJpbnRlZ2VyXCJcbiAgICAgICAgICB0eXBlID0gXCJpbnRcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgdHlwZSA9IHByb3BlcnR5LnR5cGVcbiAgICAgICAgb3B0aW9uc1trZXldID0ge1xuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgcmVxdWlyZWQ6ICEhcHJvcGVydHkucmVxdWlyZWRcbiAgICAgICAgfVxuICAgIHRoaXMuc2NoZW1hT3B0aW9ucyA9IG9wdGlvbnNcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNjb3ZlcnlTY2hlbWEiXX0=
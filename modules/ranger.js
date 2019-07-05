(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions);
    global.ranger = mod.exports;
  }
})(this, function (_exports, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ranger = _exports.Limitter = void 0;

  var Limitter = function Limitter(max, min) {
    this.value = 0;

    if (typeof max !== "number" || (0, _functions.isAbsoluteNaN)(min)) {
      this.maximum = Number.POSITIVE_INFINITY;
    } else {
      this.maximum = max;
    }

    if (typeof min !== "number" || (0, _functions.isAbsoluteNaN)(min)) {
      this.minimum = 0;
    } else {
      this.minimum = min;
    }
  };

  _exports.Limitter = Limitter;
  var LimitterPrototype = {
    expectIn: function expectIn(setValue) {
      return setValue === (0, _functions.limitNumber)(setValue, this.maximum, this.minimum);
    },
    expectOut: function expectOut(setValue) {
      return setValue !== (0, _functions.limitNumber)(setValue, this.maximum, this.minimum);
    },
    addExpectIn: function addExpectIn(addValue) {
      var destValue = this.value + addValue;
      return destValue === (0, _functions.limitNumber)(destValue, this.maximum, this.minimum);
    },
    addExpectOut: function addExpectOut(addValue) {
      var destValue = this.value + addValue;
      return destValue !== (0, _functions.limitNumber)(destValue, this.maximum, this.minimum);
    },
    set: function set(setValue) {
      this.value = setValue;
      return this;
    },
    add: function add(addValue) {
      this.value = this.value + addValue;
      return this;
    }
  };
  Object.defineProperties(LimitterPrototype, {
    done: {
      get: function get() {
        return this.value === (0, _functions.limitNumber)(this.value, this.maximum, this.minimum);
      }
    }
  });
  Limitter.prototype = LimitterPrototype;

  var ranger = function ranger(max, min) {
    return new Limitter(max, min);
  };

  _exports.ranger = ranger;
});
//# sourceMappingURL=ranger.js.map
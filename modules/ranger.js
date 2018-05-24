(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.number.constructor", "../functions/nice", "../functions/isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.number.constructor"), require("../functions/nice"), require("../functions/isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Number, global.nice, global.isLike);
    global.ranger = mod.exports;
  }
})(this, function (_exports, _es6Number, _nice, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ranger = _exports.Limitter = void 0;

  var Limitter = function Limitter(max, min) {
    this.value = 0;

    if (typeof max !== "number" || (0, _isLike.isAbsoluteNaN)(min)) {
      this.maximum = Number.POSITIVE_INFINITY;
    } else {
      this.maximum = max;
    }

    if (typeof min !== "number" || (0, _isLike.isAbsoluteNaN)(min)) {
      this.minimum = 0;
    } else {
      this.minimum = min;
    }
  };

  _exports.Limitter = Limitter;
  var LimitterPrototype = {
    expectIn: function expectIn(setValue) {
      return setValue === (0, _nice.limitOf)(setValue, this.maximum, this.minimum);
    },
    expectOut: function expectOut(setValue) {
      return setValue !== (0, _nice.limitOf)(setValue, this.maximum, this.minimum);
    },
    addExpectIn: function addExpectIn(addValue) {
      var destValue = this.value + addValue;
      return destValue === (0, _nice.limitOf)(destValue, this.maximum, this.minimum);
    },
    addExpectOut: function addExpectOut(addValue) {
      var destValue = this.value + addValue;
      return destValue !== (0, _nice.limitOf)(destValue, this.maximum, this.minimum);
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
        return this.value === (0, _nice.limitOf)(this.value, this.maximum, this.minimum);
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
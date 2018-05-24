(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.number.constructor", "./isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.number.constructor"), require("./isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Number, global.isLike);
    global.nice = mod.exports;
  }
})(this, function (_exports, _es6Number, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.limitOf = void 0;

  var limitOf = function () {
    var limitNumber = function limitNumber(number, max, min) {
      if (typeof number == "number") {
        if ((0, _isLike.isAbsoluteNaN)(number) || number === Infinity) {
          return min;
        }

        if ((0, _isLike.isNumber)(min) && number < min) {
          return min;
        }

        if ((0, _isLike.isNumber)(max) && number > max) {
          return max;
        }
      }

      return number;
    };

    var limitOf = function limitOf(numbers, max, min) {
      if (typeof max !== "number") {
        max = Number.POSITIVE_INFINITY;
      }

      if (typeof min !== "number") {
        if (min === null || (0, _isLike.isAbsoluteNaN)(min)) {
          min = Number.NEGATIVE_INFINITY;
        } else {
          min = 0;
        }
      }

      if ((0, _isLike.isArray)(numbers)) {
        for (var d = numbers, i = 0, l = d.length; i < l; i++) {
          d[i] = limitNumber(d[i], max, min);
        }

        return numbers;
      } else {
        return limitNumber(numbers, max, min);
      }
    };

    return limitOf;
  }();

  _exports.limitOf = limitOf;
});
//# sourceMappingURL=nice.js.map
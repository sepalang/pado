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
  _exports.accurateTimeout = _exports.limitOf = void 0;

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

  var accurateTimeout = function (originalTimeout) {
    return function (trigger, time, resolutionRatio, coverage) {
      if (time === void 0) {
        time = 0;
      }

      if (resolutionRatio === void 0) {
        resolutionRatio = 0.75;
      }

      if (coverage === void 0) {
        coverage = 25;
      }

      var destTime = Date.now() + time;

      if (!(0, _isLike.isNumber)(time)) {
        time = 0;
      }

      if (!(0, _isLike.isNumber)(resolutionRatio)) {
        resolutionRatio = 0.75;
      }

      if (!(0, _isLike.isNumber)(coverage)) {
        resolutionRatio = 25;
      }

      if (resolutionRatio > 1) {
        resolutionRatio = 1;
      }

      if (resolutionRatio < 0.1) {
        resolutionRatio = 0.1;
      }

      if (coverage < 5) {
        coverage = 5;
      }

      function preparation(restTime) {
        var preparaTime = Math.floor(restTime * resolutionRatio);
        originalTimeout(execution, preparaTime);
      }

      function execution() {
        var restTime = destTime - Date.now();

        if (restTime < coverage) {
          if (restTime < 1) {
            originalTimeout(trigger, 0);
          } else {
            originalTimeout(trigger, restTime);
          }
        } else {
          preparation(restTime);
        }
      }

      execution();
    };
  }(setTimeout);

  _exports.accurateTimeout = accurateTimeout;
});
//# sourceMappingURL=nice.js.map
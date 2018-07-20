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
  _exports.turnTimes = _exports.turn = _exports.accurateTimeout = _exports.limitNumber = void 0;

  var limitNumber = function () {
    var limitOf = function limitOf(number, max, min) {
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

    var limitNumber = function limitNumber(numbers, max, min) {
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
          d[i] = limitOf(d[i], max, min);
        }

        return numbers;
      } else {
        return limitOf(numbers, max, min);
      }
    };

    return limitNumber;
  }();

  _exports.limitNumber = limitNumber;

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

  var turn = function turn(i, limit, ts, resultHook) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = limit - (abs > limit ? abs % limit : abs);
    }

    ts = typeof ts === "number" ? ts : 1;
    var fixIndex = Math.floor(i / ts);
    var r = limit > fixIndex ? fixIndex : fixIndex % limit;
    return typeof resultHook === "function" ? resultHook(r, i, limit, ts) : r;
  };

  _exports.turn = turn;

  var turnTimes = function turnTimes(i, limit, ts) {
    return turn(i, limit, ts, function (r, i, limit, ts) {
      return [r, Math.floor(i / (limit * ts))];
    });
  };

  _exports.turnTimes = turnTimes;
});
//# sourceMappingURL=nice.js.map
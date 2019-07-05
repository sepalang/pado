(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.cast);
    global.nice = mod.exports;
  }
})(this, function (_exports, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.toggle = _exports.turnTime = _exports.turn = _exports.accurateTimeout = _exports.limitNumber = void 0;

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
    var result = limit > fixIndex ? fixIndex : fixIndex % limit;
    return typeof resultHook === "function" ? resultHook(result, i, limit, ts) : result;
  };

  _exports.turn = turn;

  var turnTime = function turnTime(i, limit, ts) {
    return turn(i, limit, ts, function (result, i, limit, ts) {
      return [result, Math.floor(i / (limit * ts))];
    });
  };

  _exports.turnTime = turnTime;

  var toggle = function toggle(toggleArgs, currentValue, step) {
    if (step === void 0) {
      step = 1;
    }

    return (toggleArgs = (0, _cast.asArray)(toggleArgs)) && toggleArgs[(toggleArgs.findIndex(function (val) {
      return val === currentValue;
    }) + step) % toggleArgs.length];
  };

  _exports.toggle = toggle;
});
//# sourceMappingURL=nice.js.map
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike);
    global.accurate = mod.exports;
  }
})(this, function (_exports, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.accurateTimeout = void 0;

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
//# sourceMappingURL=accurate.js.map
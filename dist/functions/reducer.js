(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./asTo"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./asTo"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.asTo);
    global.reducer = mod.exports;
  }
})(this, function (_exports, _isLike, _asTo) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.max = _exports.turn = _exports.get = void 0;

  var get = function get(target, path) {
    if (typeof target === "object") {
      switch (typeof path) {
        case "number":
          path += "";

        case "string":
          return path.indexOf("[") == 0 ? eval("target" + path) : eval("target." + path);

        case "function":
          return path.call(this, target);
      }
    } else if (typeof target === "function") {
      return target.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    return target;
  };

  _exports.get = get;

  var turn = function turn(i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }

    ts = ts || 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  };

  _exports.turn = turn;

  var max = function max(numberList) {
    var result;
    (0, _asTo.asArray)(numberList).forEach(function (n) {
      if ((0, _isLike.isNumber)(n)) {
        if (typeof result !== "number") {
          result = n;
          return;
        }

        if (result < n) {
          result = n;
        }
      }
    });
    return result;
  };

  _exports.max = max;
});
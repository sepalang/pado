(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./cast", "lodash/isObject", "lodash/isEmpty", "lodash/isArray", "lodash/get"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./cast"), require("lodash/isObject"), require("lodash/isEmpty"), require("lodash/isArray"), require("lodash/get"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.cast, global.isObject, global.isEmpty, global.isArray, global.get);
    global.reducer = mod.exports;
  }
})(this, function (_exports, _isLike, _cast, _isObject2, _isEmpty2, _isArray2, _get2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.max = _exports.turn = _exports.hasProperty = _exports.get = void 0;
  _isObject2 = _interopRequireDefault(_isObject2);
  _isEmpty2 = _interopRequireDefault(_isEmpty2);
  _isArray2 = _interopRequireDefault(_isArray2);
  _get2 = _interopRequireDefault(_get2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  var hasProperty = function hasProperty(obj, value, key) {
    if (arguments.length == 1 && (0, _isObject2.default)(obj)) return (0, _isEmpty2.default)(obj);
    if ((0, _isArray2.default)(obj)) for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i] === value) return true;
    }

    if ((0, _isObject2.default)(obj)) {
      if (key) {
        return (0, _get2.default)(obj, key) === value;
      } else {
        for (var key in obj) {
          if ((0, _get2.default)(obj, key) === value) return true;
        }
      }
    }

    return false;
  };

  _exports.hasProperty = hasProperty;

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
    (0, _cast.asArray)(numberList).forEach(function (n) {
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
//# sourceMappingURL=reducer.js.map
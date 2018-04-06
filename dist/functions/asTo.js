(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.split", "./isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.split"), require("./isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.isLike);
    global.asTo = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.asObject = _exports.toArray = _exports.asArray = void 0;

  var asArray = function asArray(data, defaultArray) {
    if (defaultArray === void 0) {
      defaultArray = undefined;
    }

    if ((0, _isLike.isArray)(data)) {
      return data;
    }

    if ((0, _isLike.isNone)(data)) {
      return (0, _isLike.isArray)(defaultArray) ? defaultArray : (0, _isLike.isNone)(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
  };

  _exports.asArray = asArray;

  var toArray = function toArray(data, option) {
    if (typeof data === "undefined" || data === null || data === NaN) return [];
    if ((0, _isLike.isArray)(data)) return Array.prototype.slice.call(data);
    if (typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if (typeof data === "string", typeof option === "string") return data.split(option);
    return [data];
  };

  _exports.toArray = toArray;

  var asObject = function asObject(data, defaultKey) {
    if (defaultKey === void 0) {
      defaultKey = "value";
    }

    if ((0, _isLike.isPlainObject)(data)) {
      return data;
    } else {
      var _ref;

      return _ref = {}, _ref[defaultKey] = data, _ref;
    }
  };

  _exports.asObject = asObject;
});
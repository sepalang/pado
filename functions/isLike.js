(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "lodash/isPlainObject"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("lodash/isPlainObject"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isPlainObject);
    global.isLike = mod.exports;
  }
})(this, function (_exports, _isPlainObject2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.notExsist = _exports.isExsist = _exports.isPlainObject = _exports.likeRegexp = _exports.isEmpty = _exports.isNode = _exports.likeArray = _exports.likeNumber = _exports.likeString = _exports.isFunction = _exports.isObject = _exports.isArray = _exports.isInteger = _exports.isNumber = _exports.isNone = _exports.isAbsoluteNaN = void 0;
  _isPlainObject2 = _interopRequireDefault(_isPlainObject2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

  var isAbsoluteNaN = function isAbsoluteNaN(number) {
    return number !== number && typeof number === "number";
  };

  _exports.isAbsoluteNaN = isAbsoluteNaN;

  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };

  _exports.isNone = isNone;

  var isNumber = function isNumber() {
    return typeof num === "number" && !isAbsoluteNaN(num);
  };

  _exports.isNumber = isNumber;

  var isInteger = function isInteger(value) {
    //NaN, null, undefined
    if (isNone(value) === true) return false;

    if (typeof value === "string") {
      value = value.trim();
    }

    if (!/string|number/.test(typeof value) || value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY || isNaN(value)) {
      return false;
    }

    return value == parseInt(value, 10);
  };

  _exports.isInteger = isInteger;

  var isArray = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };

  _exports.isArray = isArray;

  var isObject = function isObject(object) {
    return object !== null && typeof object === "object" ? true : false;
  };

  _exports.isObject = isObject;

  var isFunction = function isFunction(f) {
    return typeof f === "function";
  };

  _exports.isFunction = isFunction;

  var likeString = function likeString(data) {
    if (typeof data === "string") return true;
    if (isNumber(data)) return true;
    return false;
  };

  _exports.likeString = likeString;

  var likeNumber = function likeNumber(data) {
    if (isNumber(data)) return true;
    if (typeof data === "string") return String(parseFloat(t)) === String(t);
    return false;
  };

  _exports.likeNumber = likeNumber;

  var likeArray = function (nodeFn, webFn) {
    var definedNodeList;

    try {
      definedNodeList = 0 instanceof NodeList;
      definedNodeList = true;
    } catch (e) {
      definedNodeList = false;
    }

    return definedNodeList ? webFn : nodeFn;
  }( //nodeFn
  function (data) {
    return isArray(data);
  }, //webFn
  function (data) {
    return isArray(data) || data instanceof NodeList;
  }); //TODO : native isPlainObject


  _exports.likeArray = likeArray;

  var isNode = function isNode(a) {
    return isObject(a) && typeof a.nodeType === "number";
  };

  _exports.isNode = isNode;

  var isEmpty = function isEmpty() {
    if (typeof o === "undefined") return true;
    if (typeof o === "string") return o.trim().length < 1 ? true : false;

    if (typeof o === "object") {
      if (o == null) return true;
      if (o instanceof RegExp) return false;

      if (isArray(o)) {
        return !o.length;
      } else {
        for (var prop in o) {
          return false;
        }

        return true;
      }
    }

    if (typeof o === "number") return false;
    if (typeof o === "function") return false;
    if (typeof o === "boolean") return false;
    return true;
  };

  _exports.isEmpty = isEmpty;

  var likeRegexp = function likeRegexp(s) {
    return typeof s === "string" || s instanceof RegExp;
  };

  _exports.likeRegexp = likeRegexp;

  var isPlainObject = function isPlainObject(data) {
    return (0, _isPlainObject2.default)(data);
  };

  _exports.isPlainObject = isPlainObject;

  var isExsist = function isExsist(value) {
    if (value === true) {
      return true;
    }

    if (value === false) {
      return false;
    }

    if (typeof value === "string" || typeof value === "number") {
      return true;
    } else {
      return false;
    }
  };

  _exports.isExsist = isExsist;
  var notExsist = _exports.notExsist = notExsist = (_readOnlyError("notExsist"), function (value) {
    return !isExsist(value);
  });
  _exports.notExsist = notExsist;
});
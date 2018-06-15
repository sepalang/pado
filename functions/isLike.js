(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.sort", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/es6.regexp.constructor", "core-js/modules/es6.number.constructor"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.sort"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/es6.regexp.constructor"), require("core-js/modules/es6.number.constructor"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.webDom, global.es6Array, global.es6Object, global.es6Regexp, global.es6Number);
    global.isLike = mod.exports;
  }
})(this, function (_exports, _es6Array, _webDom, _es6Array2, _es6Object, _es6Regexp, _es6Number) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.likePromise = _exports.notExsist = _exports.isExsist = _exports.eqeq = _exports.likeEqual = _exports.isEqual = _exports.eqof = _exports.isEnumerableObject = _exports.isPlainObject = _exports.likeRegexp = _exports.isPresence = _exports.isEmpty = _exports.isNode = _exports.likeArray = _exports.likeNumber = _exports.likeString = _exports.likeObject = _exports.isFunction = _exports.isObject = _exports.isArray = _exports.isInteger = _exports.isInfinity = _exports.isNumber = _exports.isNone = _exports.isAbsoluteNaN = void 0;

  var isAbsoluteNaN = function isAbsoluteNaN(it) {
    return it !== it && typeof it === "number";
  };

  _exports.isAbsoluteNaN = isAbsoluteNaN;

  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };

  _exports.isNone = isNone;

  var isNumber = function isNumber(it) {
    return typeof it === "number" && !isAbsoluteNaN(it);
  };

  _exports.isNumber = isNumber;

  var isInfinity = function isInfinity(it) {
    return it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY;
  };

  _exports.isInfinity = isInfinity;

  var isInteger = function isInteger(value) {
    //NaN, null, undefined
    if (isNone(value) === true) return false;

    if (typeof value === "string") {
      value = value.trim();
    }

    if (!/string|number/.test(typeof value) || isInfinity(value) || isNaN(value)) {
      return false;
    }

    return value == parseInt(value, 10);
  };

  _exports.isInteger = isInteger;

  var isArray = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };

  _exports.isArray = isArray;

  var isObject = function isObject(it) {
    return it !== null && typeof it === "object" ? true : false;
  };

  _exports.isObject = isObject;

  var isFunction = function isFunction(it) {
    return typeof it === "function";
  };
  /*
    * likeObject is have hasOwnProperty
  */


  _exports.isFunction = isFunction;

  var likeObject = function likeObject(it) {
    return isObject(it) || isFunction(it);
  };

  _exports.likeObject = likeObject;

  var likeString = function likeString(data) {
    if (typeof data === "string") return true;
    if (isNumber(data)) return true;
    return false;
  };

  _exports.likeString = likeString;

  var likeNumber = function likeNumber(data) {
    if (isNumber(data) || isInfinity(data)) return true;
    if (typeof data === "string") return String(parseFloat(data)) === String(data);
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

  var isEmpty = function isEmpty(it) {
    if (typeof it === "undefined") return true;
    if (typeof it === "string") return it.trim().length < 1 ? true : false;

    if (typeof it === "object") {
      if (it == null) return true;
      if (it instanceof RegExp) return false;

      if (isArray(it)) {
        return !it.length;
      } else {
        for (var prop in it) {
          return false;
        }

        return true;
      }
    }

    if (typeof it === "number") {
      //NaN check || false
      return it !== it || false;
    }

    if (typeof it === "function") return false;
    if (typeof it === "boolean") return false;
    return true;
  }; // check JSON, input.value possible value


  _exports.isEmpty = isEmpty;

  var isPresence = function isPresence(it) {
    return it === undefined || isAbsoluteNaN(it) ? false : true;
  };

  _exports.isPresence = isPresence;

  var likeRegexp = function likeRegexp(s) {
    return typeof s === "string" || s instanceof RegExp;
  };

  _exports.likeRegexp = likeRegexp;

  var isPlainObject = function isPlainObject(data) {
    return typeof data === "object" && data.constructor === Object;
  };

  _exports.isPlainObject = isPlainObject;

  var isEnumerableObject = function isEnumerableObject(data) {
    return isPlainObject(data) || isArray(data);
  }; // none(undfinec, null, NaN), value(1,"1"), hash({}), array([]), node, object(new, Date), function, boolean


  _exports.isEnumerableObject = isEnumerableObject;

  var eqof = function eqof(it) {
    var typeIt = typeof it;

    switch (typeIt) {
      case "number":
        if (isAbsoluteNaN(it)) return "none";

      case "string":
        return "value";
        break;

      case "object":
        if (isNone(it)) return "none";
        if (likeArray(it)) return "array";
        if (isNode(it)) return "node";
        if (!isPlainObject(it)) return "object";
        return "hash";
        break;

      case "undefined":
        return "none";
        break;

      case "function":
      case "boolean":
      default:
        return typeIt;
        break;
    }
  };

  _exports.eqof = eqof;

  var baseEq = function baseEq(value, other, filter, depth, strict) {
    if (depth === void 0) {
      depth = 0;
    }

    if (arguments.length < 2) return false;
    var valueType = eqof(value);
    var otherType = eqof(other);
    if (valueType !== otherType) return false;

    switch (valueType) {
      case "none":
        return true;

      case "array":
        if (value.length !== other.length) {
          return false;
        }

        return value.every(function (vValue, i) {
          var oValue = other[i];
          return typeof filter === "function" && filter(i, [vValue, oValue], depth) === false ? true : baseEq(vValue, oValue, filter, depth + 1, strict);
        });
        break;

      case "hash":
        var vKeys = Object.keys(value),
            oKeys = Object.keys(other);
        if (vKeys.length !== oKeys.length || !baseEq(vKeys.sort(), oKeys.sort())) return false;
        return vKeys.every(function (key) {
          var vValue = value[key];
          var oValue = other[key];
          return typeof filter === "function" && filter(key, [vValue, oValue], depth) === false ? true : baseEq(vValue, oValue, filter, depth + 1, strict);
        });
        break;

      case "node":
      case "object":
      case "function":
      case "boolean":
      case "value":
      default:
        return strict ? value === other : value == other;
    }
  };

  var isEqual = function isEqual(value, other, filter, depth) {
    return baseEq(value, other, filter, depth, true);
  };

  _exports.isEqual = isEqual;

  var likeEqual = function likeEqual(value, other, filter, depth) {
    return baseEq(value, other, function (key, values, depth) {
      return /^(\$|\_)/.test(key) ? false : typeof filter === "function" ? filter(key, values, depth) : true;
    }, depth, true);
  };

  _exports.likeEqual = likeEqual;

  var eqeq = function eqeq(value, other, filter, depth) {
    return baseEq(value, other, filter, depth, false);
  };

  _exports.eqeq = eqeq;

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

  var notExsist = function notExsist(value) {
    return !isExsist(value);
  };

  _exports.notExsist = notExsist;

  var likePromise = function likePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
  };

  _exports.likePromise = likePromise;
});
//# sourceMappingURL=isLike.js.map
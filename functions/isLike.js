(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.isLike = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.notExsist = _exports.isExsist = _exports.likeEqual = _exports.isEqual = _exports.eqeq = _exports.eqof = _exports.isPlainObject = _exports.likeRegexp = _exports.isEmpty = _exports.isNode = _exports.likeArray = _exports.likeNumber = _exports.likeString = _exports.likeObject = _exports.isFunction = _exports.isObject = _exports.isArray = _exports.isInteger = _exports.isInfinity = _exports.isNumber = _exports.isNone = _exports.isAbsoluteNaN = void 0;

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
  };

  _exports.isEmpty = isEmpty;

  var likeRegexp = function likeRegexp(s) {
    return typeof s === "string" || s instanceof RegExp;
  };

  _exports.likeRegexp = likeRegexp;

  var isPlainObject = function isPlainObject(data) {
    return typeof data === "object" && data.constructor === Object;
  }; // none(undfinec, null, NaN), value(1,"1"), hash({}), array([]), node, object(new, Date), function, boolean


  _exports.isPlainObject = isPlainObject;

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

  var eqeq = function eqeq(value, other) {
    if (arguments.length < 2) {
      return false;
    }

    var rootType = eqof(value);

    if (rootType !== eqof(other)) {
      return false;
    }

    switch (rootType) {
      case "none":
        return true;

      default:
        return value == other;
    }
  };

  _exports.eqeq = eqeq;

  var isEqual = function isEqual(value, other) {
    if (value === other) {
      return true;
    }

    if (isAbsoluteNaN(value) && isAbsoluteNaN(other)) {
      return true;
    }
  }; // ignore _ $


  _exports.isEqual = isEqual;

  var likeEqual = function likeEqual() {};

  _exports.likeEqual = likeEqual;

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
});
//# sourceMappingURL=isLike.js.map
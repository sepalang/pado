(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./read", "./cast", "./baseFunction"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./read"), require("./cast"), require("./baseFunction"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.read, global.cast, global.baseFunction);
    global.remark = mod.exports;
  }
})(this, function (_exports, _isLike, _read, _cast, _baseFunction) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.diffStructure = _exports.findIndexes = _exports.findIndex = _exports.entries = _exports.deepKeys = _exports.keys = _exports.valueOf = _exports.fallback = void 0;

  var fallback = function fallback(value, fallbackFn) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return typeof value === "undefined" ? fallbackFn.apply(void 0, args) : value;
  };

  _exports.fallback = fallback;

  var valueOf = function valueOf(value) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return typeof value === "function" ? value.apply(void 0, args) : value;
  };

  _exports.valueOf = valueOf;
  var keys = _baseFunction.baseKeys;
  _exports.keys = keys;

  var deepKeys = function () {
    var nestedDeepKeys = function nestedDeepKeys(target, filter, scope, total) {
      if (typeof target === "object") {
        keys(target, function (key) {
          var child = target[key];
          var useKey = filter(child, key, scope.length);

          if (!useKey) {
            return;
          }

          var currentScope = (0, _cast.clone)(scope);
          currentScope.push(key);
          total.push(currentScope);
          nestedDeepKeys(child, filter, currentScope, total);
        }, true);
      }
    };

    return function (target, filter) {
      var result = [];
      nestedDeepKeys(target, filter ? function (child, key) {
        filter(child, key);
      } : function () {
        return true;
      }, [], result);
      return result;
    };
  }();

  _exports.deepKeys = deepKeys;
  var entries = _baseFunction.baseEntries;
  _exports.entries = entries;

  var findIndex = function () {
    var __find_string = function __find_string(it, search, at) {
      return it.indexOf(search, at);
    };

    var __find_regexp = function __find_regexp(it, search, at) {
      var i = it.substring(at || 0).search(search);
      return i >= 0 ? i + (at || 0) : i;
    };

    return function (it, search, at) {
      return (search instanceof RegExp ? __find_regexp : __find_string)(it, search, at);
    };
  }(); //remark.spec.js


  _exports.findIndex = findIndex;

  var findIndexes = function () {
    return function (c, s, at) {
      if (typeof c === "string" || typeof c === "number") {
        var idxs = [];
        var s = (0, _isLike.likeRegexp)(s) ? s : s + "";
        var at = !at || !(0, _isLike.isNumber)(at) || at < 0 ? 0 : at;
        var next;

        do {
          var i = findIndex(c, s, at);

          if (i > -1) {
            at = (s.length || 1) + i;
            idxs.push(i);
            next = true;
          } else {
            next = false;
          }
        } while (next);

        return idxs;
      }
    };
  }(); //TODO: Union hasValue


  _exports.findIndexes = findIndexes;

  var NESTED_HAS_PROC = function NESTED_HAS_PROC(obj, key) {
    var keys = key.split(".");
    if (!keys.length) return false;
    var pointer = obj;

    for (var ki in keys) {
      var k = keys[ki];

      if (!pointer.hasOwnProperty(k)) {
        return false;
      } else {
        pointer = pointer[k];
      }
    }

    return true;
  };

  var diffStructure = function diffStructure(before, after) {
    var afterKeys = Object.keys(after);
    var beforeKeys;
    var canDiff = false;

    if ((0, _isLike.isObject)(before)) {
      if ((0, _isLike.isArray)(before)) {
        beforeKeys = before;
      } else {
        beforeKeys = Object.keys(before);
        canDiff = true;
      }
    } else {
      beforeKeys = [];
    }

    var analysis = {
      after: after,
      before: before,
      keys: (0, _cast.unique)(afterKeys.concat(beforeKeys)).reduce(function (dest, key) {
        dest[key] = undefined;
        return dest;
      }, {}),
      match: [],
      missing: [],
      surplus: [],
      diff: [],
      pass: false //match, missing

    };

    for (var ki in beforeKeys) {
      if (!beforeKeys.hasOwnProperty(ki)) continue;
      var key = beforeKeys[ki];

      if (NESTED_HAS_PROC(after, key)) {
        analysis.match.push(key);
        analysis.keys[key] = "match";

        if (canDiff && !(0, _isLike.isEqual)((0, _read.get)(after, key), (0, _read.get)(before, key))) {
          analysis.diff.push(key);
          analysis.keys[key] = "diff";
        }
      } else {
        analysis.surplus.push(key);
        analysis.keys[key] = "surplus";
      }
    } //surplus


    (0, _cast.asArray)(afterKeys).forEach(function (key) {
      if (!(0, _read.hasValue)(analysis.match, key)) {
        analysis.missing.push(key);
        analysis.keys[key] = "missing";
      }
    }); //absolute

    analysis.pass = !analysis.missing.length && !analysis.surplus.length;
    return analysis;
  };

  _exports.diffStructure = diffStructure;
});
//# sourceMappingURL=remark.js.map
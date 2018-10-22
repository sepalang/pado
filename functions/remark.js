(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.split", "core-js/modules/es6.regexp.search", "core-js/modules/es6.regexp.match", "core-js/modules/es6.regexp.replace", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/es6.regexp.constructor", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.split"), require("core-js/modules/es6.regexp.search"), require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.regexp.replace"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/es6.regexp.constructor"), require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.webDom, global.es6Array, global.es6Object, global.es6Regexp, global.isLike, global.cast);
    global.remark = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Regexp2, _es6Regexp3, _es6Regexp4, _webDom, _es6Array, _es6Object, _es6Regexp5, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.diffStructure = _exports.findIndexes = _exports.findIndex = _exports.matchString = _exports.entries = _exports.deepKeys = _exports.keys = _exports.stringTest = _exports.valueOf = _exports.fallback = void 0;

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

  var stringTest = function stringTest(string, rule) {
    if (!(0, _isLike.likeString)(string)) return false;
    if (typeof rule === "undefined") return true;
    return (0, _isLike.likeString)(rule) ? (string + '').indexOf(rule + '') > -1 : rule instanceof RegExp ? rule.test(string) : (0, _isLike.isArray)(rule) ? rule.some(function (filterKey) {
      return filterKey === string;
    }) : typeof rule === "function" ? Boolean(rule(string)) : false;
  };

  _exports.stringTest = stringTest;

  var keys = function keys(target, filterExp, strict) {
    var result = [];
    if (!(0, _isLike.likeObject)(target)) return result;
    var filter = typeof filterExp === "function" ? function (key) {
      return filterExp(key, target);
    } : filterExp;
    (strict === true ? (0, _isLike.isArray)(target) : (0, _isLike.likeArray)(target)) && Object.keys(target).filter(function (key) {
      if (isNaN(key)) return;
      var numberKey = parseInt(key, 10);
      stringTest(numberKey, filter) && result.push(parseInt(numberKey, 10));
    }) || (strict === true ? (0, _isLike.isPlainObject)(target) : (0, _isLike.likeObject)(target)) && Object.keys(target).forEach(function (key) {
      stringTest(key, filter) && result.push(key);
    });
    return result;
  };

  _exports.keys = keys;

  var deepKeys = function () {
    var nestedDeepKeys = function nestedDeepKeys(target, filter, scope, total) {
      if (typeof target === "object") {
        keys(target, function (key, target) {
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

  var entries = function entries(it) {
    var result = [];

    switch (typeof it) {
      case "object":
        // eslint-disable-next-line no-unused-expressions
        (0, _isLike.isNone)(it) ? 0 : (0, _isLike.likeArray)(it) ? (0, _cast.asArray)(it).forEach(function (v, k) {
          result.push([k, v]);
        }) : Object.keys(it).forEach(function (key) {
          result.push([key, it[key]]);
        });
        break;
    }

    return result;
  }; //remark.spec.js


  _exports.entries = entries;

  var matchString = function matchString(it, search, at) {
    if (at === void 0) {
      at = 0;
    }

    if (typeof it !== "string") throw new Error("matchString :: worng argument " + it);
    if (typeof search === "string") search = search.replace(new RegExp("(\\.|\\[|\\])", "g"), function (s) {
      return "\\" + s;
    });
    var result = it.substr(at).match(search);
    return result ? [result.index + at, result[0].length] : [-1, 0];
  };

  _exports.matchString = matchString;

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

    if (isObject(before)) {
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
      keys: unique(afterKeys.concat(beforeKeys)).reduce(function (dest, key) {
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

        if (canDiff && !isEqual(get(after, key), get(before, key))) {
          analysis.diff.push(key);
          analysis.keys[key] = "diff";
        }
      } else {
        analysis.surplus.push(key);
        analysis.keys[key] = "surplus";
      }
    } //surplus


    (0, _cast.asArray)(afterKeys).forEach(function (key) {
      if (!hasValue(analysis.match, key)) {
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
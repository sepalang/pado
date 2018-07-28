(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.search", "core-js/modules/es6.regexp.match", "core-js/modules/es6.regexp.constructor", "core-js/modules/es6.regexp.replace", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.search"), require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.regexp.constructor"), require("core-js/modules/es6.regexp.replace"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.webDom, global.es6Array, global.es6Object, global.isLike, global.cast);
    global.remark = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Regexp2, _es6Regexp3, _es6Regexp4, _webDom, _es6Array, _es6Object, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.findIndexes = _exports.findIndex = _exports.matchString = _exports.deepKeys = _exports.entries = _exports.keys = void 0;

  var keys = function keys(target, filterExp, strict) {
    var result = [];
    if (!(0, _isLike.likeObject)(target)) return result;
    var filter = typeof filterExp === "function" ? filterExp : function () {
      return true;
    };
    (strict === true ? (0, _isLike.isArray)(target) : (0, _isLike.likeArray)(target)) && Object.keys(target).filter(function (key) {
      if (isNaN(key)) return;
      var numberKey = parseInt(key, 10);
      filter(numberKey, target) && result.push(parseInt(numberKey, 10));
    }) || (strict === true ? (0, _isLike.isPlainObject)(target) : (0, _isLike.likeObject)(target)) && Object.keys(target).forEach(function (key) {
      filter(key, target) && result.push(key);
    });
    return result;
  };

  _exports.keys = keys;

  var entries = function entries(it) {
    var result = [];

    switch (typeof it) {
      case "object":
        (0, _isLike.isNone)(it) ? 0 : (0, _isLike.likeArray)(it) ? (0, _cast.asArray)(it).forEach(function (v, k) {
          result.push([k, v]);
        }) : Object.keys(it).forEach(function (key) {
          result.push([key, it[key]]);
        });
        break;
    }

    return result;
  };

  _exports.entries = entries;

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
      nestedDeepKeys(target, filter ? filter(child, key) : function () {
        return true;
      }, [], result);
      return result;
    };
  }(); //remark.spec.js


  _exports.deepKeys = deepKeys;

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
        var mvc = c + "";
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
  }();

  _exports.findIndexes = findIndexes;
});
//# sourceMappingURL=remark.js.map
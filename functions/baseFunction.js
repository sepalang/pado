(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/es6.regexp.match", "core-js/modules/es6.regexp.replace", "core-js/modules/es6.regexp.constructor", "./isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.regexp.replace"), require("core-js/modules/es6.regexp.constructor"), require("./isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6Array, global.es6Object, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.isLike);
    global.baseFunction = mod.exports;
  }
})(this, function (_exports, _webDom, _es6Array, _es6Object, _es6Regexp, _es6Regexp2, _es6Regexp3, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.baseEntries = _exports.baseKeys = _exports.matchString = _exports.stringTest = _exports.baseAsArray = void 0;

  var baseAsArray = function baseAsArray(data, defaultArray) {
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

  _exports.baseAsArray = baseAsArray;

  var stringTest = function stringTest(string, rule, meta) {
    if (!(0, _isLike.likeString)(string)) return false;
    if (typeof rule === "undefined") return true;
    return typeof rule === "function" ? Boolean(rule(string, meta)) : (0, _isLike.likeString)(rule) ? (string + '').indexOf(rule + '') > -1 : rule instanceof RegExp ? rule.test(string) : (0, _isLike.isArray)(rule) ? rule.some(function (filterKey) {
      return filterKey === string;
    }) : false;
  }; //remark.spec.js


  _exports.stringTest = stringTest;

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

  var baseKeys = function baseKeys(target, filterExp, strict) {
    var result = [];

    if (!(0, _isLike.likeObject)(target)) {
      return result;
    }

    if (strict === true ? (0, _isLike.isArray)(target) : (0, _isLike.likeArray)(target)) {
      Object.keys(target).filter(function (key) {
        if (isNaN(key)) return;
        var numberKey = parseInt(key, 10);
        stringTest(numberKey, filterExp, target[key]) && result.push(parseInt(numberKey, 10));
      });
    } else if (strict === true ? (0, _isLike.isPlainObject)(target) : (0, _isLike.likeObject)(target)) {
      Object.keys(target).forEach(function (key) {
        stringTest(key, filterExp, target[key]) && result.push(key);
      });
    }

    return result;
  };

  _exports.baseKeys = baseKeys;

  var baseEntries = function baseEntries(it) {
    var result = [];

    switch (typeof it) {
      case "object":
        // eslint-disable-next-line no-unused-expressions
        (0, _isLike.isNone)(it) ? 0 : (0, _isLike.likeArray)(it) ? baseAsArray(it).forEach(function (v, k) {
          result.push([k, v]);
        }) : Object.keys(it).forEach(function (key) {
          result.push([key, it[key]]);
        });
        break;
    }

    return result;
  };

  _exports.baseEntries = baseEntries;
});
//# sourceMappingURL=baseFunction.js.map
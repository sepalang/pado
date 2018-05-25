(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.sort", "core-js/modules/es6.number.constructor", "core-js/modules/es6.regexp.search", "core-js/modules/es6.regexp.match", "core-js/modules/es6.regexp.constructor", "core-js/modules/es6.regexp.replace", "./isLike", "./cast", "./read"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.sort"), require("core-js/modules/es6.number.constructor"), require("core-js/modules/es6.regexp.search"), require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.regexp.constructor"), require("core-js/modules/es6.regexp.replace"), require("./isLike"), require("./cast"), require("./read"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Number, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.isLike, global.cast, global.read);
    global.reducer = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Number, _es6Regexp, _es6Regexp2, _es6Regexp3, _es6Regexp4, _isLike, _cast, _read) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.top = _exports.cut = _exports.findIndexes = _exports.findIndex = _exports.matchString = void 0;

  //reducer.spec.js
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
  }(); //reducer.spec.js


  _exports.findIndex = findIndex;

  var findIndexes = function () {
    return function (c, s, at) {
      if (typeof c === "string" || typeof c === "number") {
        var idxs = [],
            mvc = c + "",
            s = (0, _isLike.likeRegexp)(s) ? s : s + "",
            at = !at || !(0, _isLike.isNumber)(at) || at < 0 ? 0 : at,
            next;

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
  }(); //reducer.spec.js


  _exports.findIndexes = findIndexes;

  var cut = function cut(collection, cutLength, emptyDefault) {
    if (cutLength === void 0) {
      cutLength = 1;
    }

    if (emptyDefault === void 0) {
      emptyDefault = undefined;
    }

    var data = (0, _cast.asArray)(collection);
    var fill = emptyDefault;

    if (data.length > cutLength) {
      data.splice(cutLength, Number.POSITIVE_INFINITY);
      return data;
    }

    var dataLength = data.length;

    if (typeof emptyDefault !== "function") {
      fill = function fill() {
        return emptyDefault;
      };
    }

    for (var i = 0, l = cutLength - dataLength; i < l; i++) {
      data.push(fill(dataLength++, i));
    }

    return data;
  }; //reducer.spec.js


  _exports.cut = cut;

  var top = function top(data, iteratee, topLength) {
    switch (typeof iteratee) {
      case "function":
        //iteratee=iteratee;
        break;

      case "boolean":
        iteratee = iteratee ? function (a, b) {
          return a < b;
        } : function (a, b) {
          return a > b;
        };
        break;

      default:
        iteratee = function iteratee(a, b) {
          return a < b;
        };

        break;
    }

    if (typeof topLength === "boolean") {
      topLength = topLength ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    return (0, _isLike.isNumber)(topLength) || (0, _isLike.isInfinity)(topLength) ? (0, _cast.asArray)(data).sort(function (a, b) {
      return iteratee(a, b);
    }).splice(0, topLength) : (0, _cast.asArray)(data).sort(function (a, b) {
      return iteratee(a, b);
    })[0];
  };

  _exports.top = top;
});
//# sourceMappingURL=reducer.js.map
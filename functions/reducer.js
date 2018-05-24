(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.sort", "core-js/modules/es6.number.constructor", "core-js/modules/es6.regexp.search", "core-js/modules/es6.regexp.match", "core-js/modules/es6.regexp.constructor", "core-js/modules/es6.regexp.replace", "./isLike", "./cast", "./enumerable", "lodash/get"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.sort"), require("core-js/modules/es6.number.constructor"), require("core-js/modules/es6.regexp.search"), require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.regexp.constructor"), require("core-js/modules/es6.regexp.replace"), require("./isLike"), require("./cast"), require("./enumerable"), require("lodash/get"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Number, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.es6Regexp, global.isLike, global.cast, global.enumerable, global.get);
    global.reducer = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Number, _es6Regexp, _es6Regexp2, _es6Regexp3, _es6Regexp4, _isLike, _cast, _enumerable, _get2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.turn = _exports.hasValueProperty = _exports.hasProperty = _exports.get = _exports.top = _exports.cut = _exports.findIndexes = _exports.findIndex = _exports.matchString = void 0;
  _get2 = _interopRequireDefault(_get2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  //reducer.spec.js
  var matchString = function matchString(it, search, at) {
    if (at === void 0) {
      at = 0;
    }

    if (typeof search === "string") search = search.replace(new RegExp("\\.", "g"), "\\.");
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

  var hasProperty = function hasProperty(target, pathParam) {
    return (0, _enumerable.all)((0, _cast.castPath)(pathParam), function (path) {
      if ((0, _isLike.likeObject)(target) && (0, _isLike.likeString)(path) && target.hasOwnProperty(path)) {
        target = target[path];
        return true;
      }

      return false;
    });
  };

  _exports.hasProperty = hasProperty;

  var hasValueProperty = function hasValueProperty(obj, value, key) {
    if (arguments.length == 1 && (0, _isLike.likeObject)(obj)) return (0, _isLike.isEmpty)(obj);
    if ((0, _isLike.isArray)(obj)) for (var i = 0, l = obj.length; i < l; i++) {
      if (obj[i] === value) return true;
    }

    if ((0, _isLike.likeObject)(obj)) {
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

  _exports.hasValueProperty = hasValueProperty;

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
});
//# sourceMappingURL=reducer.js.map
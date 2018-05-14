(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.match", "core-js/modules/es6.array.sort", "core-js/modules/es6.regexp.search", "./isLike", "./cast", "./enumerator", "lodash/get"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.array.sort"), require("core-js/modules/es6.regexp.search"), require("./isLike"), require("./cast"), require("./enumerator"), require("lodash/get"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Array, global.es6Regexp, global.isLike, global.cast, global.enumerator, global.get);
    global.reducer = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Array, _es6Regexp2, _isLike, _cast, _enumerator, _get2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.turn = _exports.hasValueProperty = _exports.hasProperty = _exports.get = _exports.castPath = _exports.castString = _exports.top = _exports.cut = _exports.findIndexes = _exports.findIndex = void 0;
  _get2 = _interopRequireDefault(_get2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  //reducer.spec.js
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
  }();

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
  };

  _exports.cut = cut;

  var top = function top(data, iteratee, topLength) {
    if (typeof iteratee !== "function") {
      iteratee = function iteratee(a, b) {
        return a < b;
      };
    }

    if (typeof topLength === "boolean") {
      topLength = topLength ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    return (0, _isLike.isNumber)(topLength) || (0, _isLike.isInfinity)(topLength) ? (0, _cast.asArray)(data).sort(function (a, b) {
      return iteratee(a, b);
    }).splice(0, topLength) : (0, _cast.asArray)(data).sort(function (a, b) {
      return iteratee(a, b);
    })[0];
  }; //


  _exports.top = top;

  var castString = function castString(text, matches, castFn, property) {
    var cursorStart = (0, _isLike.isNumber)(property.start) && property.start > 0 ? property.start : 0;
    var cursorEnd = (0, _isLike.isNumber)(property.end) ? property.end : text.length;
    var cursor = cursorStart;

    var open = function open(_ref) {
      var cursorStart = _ref.cursorStart,
          cursorEnd = _ref.cursorEnd,
          cursor = _ref.cursor,
          matches = _ref.matches;
      max(matches.map(function (matchExp) {
        findIndex();
      }));
    };

    open({
      cursorStart: cursorStart,
      cursorEnd: cursorEnd,
      cursor: cursor,
      matches: matches
    });
    return property;
  };

  _exports.castString = castString;

  var castPath = function castPath(pathParam) {
    if ((0, _isLike.isArray)(pathParam)) {
      return pathParam;
    }

    if ((0, _isLike.likeString)(pathParam)) {
      if ((0, _isLike.isNumber)(pathParam)) {
        return [pathParam];
      }

      if (typeof pathParam === "string") {
        var _castString = castString(pathParam, [".", "["], function (_ref2) {
          var meta = _ref2.property.meta,
              matchType = _ref2.matchType,
              match = _ref2.match,
              casting = _ref2.casting,
              fork = _ref2.fork,
              nextIndex = _ref2.nextIndex,
              next = _ref2.next,
              skip = _ref2.skip;

          switch (matchType) {
            // "."
            case 0:
              meta.push(casting);
              next(nextIndex);
              break;
            // "]"

            case 1:
              var lead = 1,
                  feet = 0;
              fork(["[", "]"], function (_ref3) {
                var matchType = _ref3.matchType,
                    match = _ref3.match,
                    casting = _ref3.casting,
                    nextIndex = _ref3.nextIndex,
                    next = _ref3.next,
                    skip = _ref3.skip;
                matchType === 0 && lead++;
                matchType === 1 && feet++;

                if (lead === feet) {
                  meta.push(casting.substr(1));
                  next(nextIndex);
                } else {
                  skip();
                }
              });
              break;
            //end

            case -1:
              meta.push(casting);
              break;

            default:
              skip();
              break;
          }

          skip();
        }, {
          meta: []
        }),
            result = _castString.meta.result;

        return result;
      }
    }

    return [];
  };

  _exports.castPath = castPath;

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
    return (0, _enumerator.all)(castPath(pathParam), function (path) {
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
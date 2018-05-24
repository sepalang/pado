(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.find-index", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable", "core-js/modules/es6.regexp.replace", "core-js/modules/es6.regexp.split", "./isLike", "./reducer"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.find-index"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.regexp.replace"), require("core-js/modules/es6.regexp.split"), require("./isLike"), require("./reducer"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Array, global.es6Object, global.webDom, global.es6Regexp, global.es6Regexp, global.isLike, global.reducer);
    global.cast = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Array2, _es6Object, _webDom, _es6Regexp, _es6Regexp2, _isLike, _reducer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.alloc = _exports.instance = _exports.removeValue = _exports.free = _exports.castPath = _exports.castString = _exports.cloneDeep = _exports.clone = _exports.deepEntries = _exports.keys = _exports.entries = _exports.cleanObject = _exports.toNumber = _exports.asObject = _exports.toArray = _exports.asArray = void 0;

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var asArray = function asArray(data, defaultArray) {
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

  _exports.asArray = asArray;

  var toArray = function toArray(data, option) {
    if (typeof data === "undefined" || data === null || data === NaN) return [];
    if ((0, _isLike.isArray)(data)) return Array.prototype.slice.call(data);
    if (typeof data === "object" && typeof data.toArray === "function") return data.toArray();
    if (typeof data === "string", typeof option === "string") return data.split(option);
    return [data];
  };

  _exports.toArray = toArray;

  var asObject = function asObject(data, defaultKey) {
    if (defaultKey === void 0) {
      defaultKey = "default";
    }

    if ((0, _isLike.isPlainObject)(data)) {
      return data;
    } else {
      var _ref;

      return _ref = {}, _ref[defaultKey] = data, _ref;
    }
  };

  _exports.asObject = asObject;

  var toNumber = function toNumber(v, d) {
    switch (typeof v) {
      case "number":
        return v;

      case "string":
        var r = v.replace(/[^.\d\-]/g, "") * 1;
        return (0, _isLike.isAbsoluteNaN)(r) ? 0 : r;
        break;
    }

    switch (typeof d) {
      case "number":
        return d;

      case "string":
        var r = d * 1;
        return (0, _isLike.isAbsoluteNaN)(r) ? 0 : r;
        break;
    }

    return 0;
  };

  _exports.toNumber = toNumber;

  var cleanObject = function cleanObject(data) {
    if (data instanceof Array) {
      Array.prototype.splice.call(data, 0, data.length);
    } else if (typeof data == "object") {
      Object.keys(data).forEach(function (key) {
        delete data[key];
      });
    }

    return data;
  };

  _exports.cleanObject = cleanObject;

  var entries = function entries(it) {
    var result = [];

    switch (typeof it) {
      case "object":
        (0, _isLike.isNone)(it) ? 0 : (0, _isLike.likeArray)(it) ? asArray(it).forEach(function (v, k) {
          result.push([k, v]);
        }) : Object.keys(it).forEach(function (key) {
          result.push([key, it[key]]);
        });
        break;
    }

    return result;
  };

  _exports.entries = entries;

  var keys = function keys(target, filterExp) {
    var result = [];
    var filter = typeof filterExp === "function" ? filterExp : function () {
      return true;
    };
    (0, _isLike.likeArray)(target) && Object.keys(target).filter(function (key) {
      !isNaN(key) && filter(key, target) && result.push(parseInt(key, 10));
    }) || (0, _isLike.likeObject)(target) && Object.keys(target).forEach(function (key) {
      filter(key, target) && result.push(key);
    });
    return result;
  };

  _exports.keys = keys;

  var deepEntries = function deepEntries(target, filter) {
    if ((0, _isLike.likeArray)(target)) {}

    if ((0, _isLike.likeObject)(target)) {}
  };

  _exports.deepEntries = deepEntries;

  var clone = function clone(target) {
    switch (typeof target) {
      case "undefined":
      case "function":
      case "boolean":
      case "number":
      case "string":
        return target;
        break;

      case "object":
        if (target === null) return target;

        if ((0, _isLike.isArray)(target)) {
          var _r = [];

          for (var i = 0, length = target.length; i < length; i++) {
            _r.push(target[i]);
          }

          return _r;
        }

        if (!(0, _isLike.isPlainObject)(target)) {
          if (target instanceof Date) {
            var _r2 = new Date();

            _r2.setTime(target.getTime());

            return _r2;
          }

          return target;
        }

        var r = {};
        Object.keys(target).forEach(function (k) {
          if (target.hasOwnProperty(k)) r[k] = target[k];
        });
        return r;
        break;

      default:
        console.error("clone::copy failed : target => ", target);
        return target;
        break;
    }
  };

  _exports.clone = clone;

  var cloneDeep = function cloneDeep(target) {
    var d;

    if (typeof target === "object") {
      if ((0, _isLike.isArray)(target)) {
        if (!(0, _isLike.isArray)(d)) {
          d = [];
        }

        ;

        for (var i = 0, l = target.length; i < l; i++) {
          d.push(typeof target[i] === "object" && target[i] !== null ? clone(target[i]) : target[i]);
        }

        return d;
      } else {
        d = {};
        Object.keys(target).forEach(function (p) {
          typeof target[p] === "object" && target[p] !== null && d[p] ? clone(target[p], d[p]) : d[p] = target[p];
        });
        return d;
      }
    } else {
      clone(target);
    }
  }; //cast.castString.spec.js


  _exports.cloneDeep = cloneDeep;

  var castString = function () {
    var rebaseMatches = function rebaseMatches(matches) {
      return entries(asArray(matches));
    };

    return function (text, matches, castFn, props) {
      var payload = {
        content: text,
        props: props
      };
      var newMatchEntries = rebaseMatches(matches);
      var castingState = {
        firstIndex: 0,
        lastIndex: text.length,
        castingStart: 0,
        cursor: 0
      };

      if (typeof props === "object" && (0, _isLike.isNumber)(props.start)) {
        castingState.castingStart = props.start;
        castingState.cursor = props.start;
      }

      var open = function open(_ref2) {
        var _ref2$castingState = _ref2.castingState,
            firstIndex = _ref2$castingState.firstIndex,
            lastIndex = _ref2$castingState.lastIndex,
            castingStart = _ref2$castingState.castingStart,
            cursor = _ref2$castingState.cursor,
            matchEntries = _ref2.matchEntries,
            castFn = _ref2.castFn,
            parentScope = _ref2.parentScope;

        if (cursor >= lastIndex) {
          return false;
        } //find match


        var matchesMap = matchEntries.map(function (_ref3) {
          var matchType = _ref3[0],
              matchExp = _ref3[1];
          return [(0, _reducer.matchString)(text, matchExp, cursor), matchType, matchExp];
        });
        var firstMatch = (0, _reducer.top)(matchesMap, function (_ref4, _ref5) {
          var a = _ref4[0],
              aPriority = _ref4[1];
          var b = _ref5[0],
              bPriority = _ref5[1];
          return a[0] < 0 ? true : b[0] < 0 ? false : a[0] == b[0] ? aPriority < bPriority : a[0] > b[0];
        }); // top match is not exsist

        if (!firstMatch) {
          return false;
        } // unmatched


        if (firstMatch[0][0] === -1) {
          firstMatch = [[-1, 0], -1, null];
        } //next variant


        var _firstMatch = firstMatch,
            _firstMatch$ = _firstMatch[0],
            matchIndex = _firstMatch$[0],
            matchSize = _firstMatch$[1],
            matchType = _firstMatch[1],
            matchExp = _firstMatch[2];
        var castStart = castingStart;
        var castEnd = matchType === -1 ? lastIndex : matchIndex + matchSize;
        var castSize = castEnd - castStart;
        var skipSize = castSize - matchSize; //next params

        var matching = {
          matchType: matchType,
          matchExp: matchExp,
          matchIndex: matchIndex,
          matchSize: matchSize,
          skipSize: skipSize
        };
        var casting = {
          firstIndex: firstIndex,
          lastIndex: lastIndex,
          castStart: castStart,
          castEnd: castEnd,
          castSize: castSize
        };
        var scope = {
          fork: function fork(matchEntries, castFn) {
            var newMatchEntries = rebaseMatches(matches);
            open({
              castingState: {
                firstIndex: matching.matchIndex,
                lastIndex: matching.matchIndex + matchSize,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: newMatchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          next: function next(needCursor) {
            var cursorTo = (0, _isLike.isNumber)(needCursor) ? needCursor : casting.castEnd;
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: cursorTo,
                cursor: cursorTo
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          enter: function enter(enterMatches, enterCastFn) {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: rebaseMatches(enterMatches),
              castFn: enterCastFn,
              parentScope: {
                next: scope.next
              }
            });
          },
          exit: function exit(needCursor) {
            parentScope && parentScope.next((0, _isLike.isNumber)(needCursor) ? needCursor : casting.castEnd);
          },
          more: function more() {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: castStart,
                cursor: casting.castEnd
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          }
        };
        castFn(_objectSpread({}, payload, matching, casting, scope));
        return true;
      };

      open({
        castingState: castingState,
        matchEntries: newMatchEntries,
        castFn: castFn
      });
      return payload;
    };
  }();

  _exports.castString = castString;

  var castPath = function () {
    var __filterDotPath = function __filterDotPath(dotPath, removeFirstDot) {
      return removeFirstDot && dotPath.indexOf(".") === 0 ? dotPath.substr(1) : dotPath;
    };

    var __filterBlockPath = function __filterBlockPath(blockPath) {
      //remove []
      blockPath = blockPath.substring(1, blockPath.length - 1); //interger

      if (/^[0-9]+$/.test(blockPath)) {
        return parseInt(blockPath, 10);
      } //remove ''


      if (/^\'.*\'$/.test(blockPath) || /^\".*\"$/.test(blockPath)) {
        blockPath = blockPath.substring(1, blockPath.length - 1);
      }

      return blockPath;
    };

    return function (pathParam) {
      if ((0, _isLike.isArray)(pathParam)) {
        return pathParam;
      }

      if ((0, _isLike.likeString)(pathParam)) {
        if ((0, _isLike.isNumber)(pathParam)) {
          return [pathParam];
        }

        if (typeof pathParam === "string") {
          var _castString = castString(pathParam, [".", "["], function (_ref6) {
            var content = _ref6.content,
                path = _ref6.props.path,
                matchExp = _ref6.matchExp,
                castStart = _ref6.castStart,
                castEnd = _ref6.castEnd,
                castSize = _ref6.castSize,
                skipSize = _ref6.skipSize,
                enter = _ref6.enter,
                next = _ref6.next;

            if (matchExp === ".") {
              skipSize && path.push(content.substr(castStart, skipSize));
              next();
            }

            if (matchExp === "[") {
              var stackCount = 0;

              if (skipSize) {
                path.push(__filterDotPath(content.substr(castStart, skipSize), castStart !== 0));
              }

              enter(["[", "]"], function (_ref7) {
                var matchExp = _ref7.matchExp,
                    castStart = _ref7.castStart,
                    castEnd = _ref7.castEnd,
                    more = _ref7.more,
                    exit = _ref7.exit;
                if (matchExp === "[") stackCount++;
                if (matchExp === "]") stackCount--;
                if (matchExp === null) return;

                if (stackCount === 0) {
                  path.push(__filterBlockPath(content.substring(castStart, castEnd)));
                  exit();
                } else {
                  more();
                }
              });
            }

            if (matchExp === null) {
              path.push(__filterDotPath(content.substr(castStart, castEnd), castStart !== 0));
            }
          }, {
            path: []
          }),
              result = _castString.props.path;

          return result;
        }
      }

      return [];
    };
  }();

  _exports.castPath = castPath;

  var free = function free(datum) {
    var dest = {};
    Object.keys(datum).forEach(function (key) {
      if (!/^\$/.test(key)) {
        dest[key] = _cloneDeep(datum[key]);
      }
    });
    return dest;
  };

  _exports.free = free;

  var getKeyWithValue = function getKeyWithValue(obj, value) {
    if ((0, _isLike.isArray)(obj)) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (obj[i] === value) return i;
      }
    }

    if ((0, _isLike.isObject)(obj)) {
      for (var key in obj) {
        if (obj[key] === value) return key;
      }
    }

    return undefined;
  };

  var removeValue = function removeValue(obj, value) {
    var detect = true;
    var array = (0, _isLike.isArray)(obj);

    while (detect) {
      var key = getKeyWithValue(obj, value);

      if (typeof key === "undefined") {
        detect = false;
      } else {
        if (array) {
          obj.splice(key, 1);
        } else {
          delete obj[key];
        }
      }
    }

    return obj;
  };

  _exports.removeValue = removeValue;

  var instance = function instance(func, proto) {
    var ins,
        DummyInstance = function DummyInstance(param) {
      if (typeof param === "object") for (var k in param) {
        this[k] = param[k];
      }
    };

    if (typeof func == "object") {
      if (typeof proto === "object") DummyInstance.prototype = proto;
      ins = new DummyInstance(func);
    }

    if (typeof func == "function") {
      if (typeof proto === "object") func.prototype = proto;
      ins = new func();
    }

    return ins;
  };

  _exports.instance = instance;

  var alloc = function alloc(init) {
    var fn = init();

    var rn = function rn() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return fn.apply(this, args);
    };

    rn['reset'] = function () {
      fn = init(rn, rn);
    };

    rn['$constructor'] = fn;
    return rn;
  };

  _exports.alloc = alloc;

  var syncData = function () {
    var ENTER_HOOK = function ENTER_HOOK(newDatum) {
      return _.assign({}, newDatum);
    };

    var UPDATE_HOOK = function UPDATE_HOOK(oldDatum, newDatum) {
      return _.assign({}, oldDatum, newDatum);
    };

    return function (oldData, newData, getId, options) {
      if (!/string|function/.test(typeof getId)) throw new Error("syncData need getId");

      if (typeof getId === "string") {
        var getIdString = getId;

        getId = function getId(e) {
          return _.get(e, getIdString);
        };
      }

      oldData = asArray(oldData);
      newData = asArray(newData);
      var result = [];
      var hooks = asObject(options, "afterEach");

      if (typeof hooks["enter"] !== "function") {
        hooks["enter"] = ENTER_HOOK;
      }

      if (typeof hooks["update"] !== "function") {
        hooks["update"] = UPDATE_HOOK;
      }

      var oldDataMap = _.map(oldData, function (e) {
        return {
          id: getId(e),
          ref: e
        };
      });

      asArray(newData).forEach(function (newDatum, i) {
        var newId = getId(newDatum);

        var oldDatum = _.get(oldDataMap[_.findIndex(oldDataMap, function (e) {
          return e.id === newId;
        })], "ref");

        var genDatum;
        var dirty = false;

        if (oldDatum) {
          // change is not dirty, modify is dirty
          if (typeof oldDatum !== typeof newDatum) {
            dirty = false;
          } else {
            // same type
            var oldOwnKeys = Object.keys(oldDatum).filter(function (key) {
              return !(key.indexOf("$") === 0);
            });
            var newOwnKeys = Object.keys(newDatum).filter(function (key) {
              return !(key.indexOf("$") === 0);
            }); // inspect key chnage

            if (_.isEqual(oldOwnKeys, newOwnKeys)) {
              dirty = !_.isEqual(_.pick(oldDatum, oldOwnKeys), _.pick(newDatum, newOwnKeys));
            } else {
              dirty = true;
            }
          }

          if (typeof hooks["beforeUpdate"] === "function") {
            if (hooks["beforeUpdate"](oldDatum, newDatum) === false) {
              return;
            }
          }

          genDatum = hooks["update"](oldDatum, newDatum);

          if (typeof hooks["afterUpdate"] === "function") {
            genDatum = hooks["afterUpdate"](genDatum, oldDatum, newDatum);
          }
        } else {
          if (typeof hooks["beforeEnter"] === "function") {
            if (hooks["beforeEnter"](newDatum) === false) {
              return;
            }
          }

          genDatum = hooks["enter"](newDatum);

          if (typeof hooks["afterEnter"] === "function") {
            genDatum = hooks["afterEnter"](genDatum, newDatum);
          }
        }

        if (typeof hooks["afterEach"] === "function") {
          hooks["afterEach"](genDatum, i, dirty);
        }

        result.push(genDatum);
      });
      return result;
    };
  }();
});
//# sourceMappingURL=cast.js.map
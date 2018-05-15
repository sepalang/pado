(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.match", "core-js/modules/es6.regexp.split", "core-js/modules/es6.object.assign", "./isLike", "./cast", "./reducer"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.regexp.split"), require("core-js/modules/es6.object.assign"), require("./isLike"), require("./cast"), require("./reducer"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Regexp, global.es6Object, global.isLike, global.cast, global.reducer);
    global.functions = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Regexp2, _es6Object, _isLike, _cast, _reducer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.turn = _exports.toggle = _exports.diffStructure = _exports.apart = _exports.rebase = _exports.sortOf = _exports.filterOf = _exports.concatOf = _exports.moveOf = _exports.insertOf = _exports.clearOf = _exports.getKeyBy = _exports.hasValue = _exports.unique = void 0;

  var unique = function unique(array) {
    var value = [],
        result = [],
        array = (0, _cast.toArray)(array);

    for (var i = 0, l = array.length; i < l; i++) {
      var unique = true;

      for (var i2 = 0, l2 = result.length; i2 < l2; i2++) {
        if (array[i] == result[i2]) {
          unique = false;
          break;
        }
      }

      if (unique == true) result.push(array[i]);
    }

    return result;
  };

  _exports.unique = unique;

  var hasValue = function () {
    var defaultObjectValueFunc = function defaultObjectValueFunc(object, value) {
      return object === value;
    };

    var functionKeyObjectValueProc = function functionKeyObjectValueProc(functionKey) {
      return function (object, value) {
        return Boolean(functionKey(object, value));
      };
    };

    var selectKeyObjectValueProc = function selectKeyObjectValueProc(leftSelect, rightSelect) {
      var useLeftSelector = typeof leftSelect === "string" || typeof leftSelect === "number";
      var useRightSelector = leftSelect === rightSelect ? useLeftSelector : typeof rightSelect === "string" || typeof rightSelect === "number";
      return function (object, value) {
        if (useLeftSelector && !object.hasOwnProperty(leftSelect)) return false;
        if (useRightSelector && !value.hasOwnProperty(rightSelect)) return false;
        return (useLeftSelector ? (0, _reducer.get)(object, leftSelect) : object) === (useRightSelector ? (0, _reducer.get)(value, rightSelect) : value);
      };
    };

    return function (obj, value, key, getKey) {
      if (typeof key === "boolean") {
        if (typeof getKey !== "boolean") {
          getKey = key;
        }

        key = void 0;
      }

      if (obj === value) {
        return true;
      } else if ((0, _isLike.isObject)(obj)) {
        if (value === void 0 && key === void 0) return !(0, _isLike.isEmpty)(obj);
        var proc;

        if (key) {
          if (typeof key === "function") {
            proc = functionKeyObjectValueProc(key);
          } else if ((0, _isLike.isArray)(key) && key.length > 1) {
            proc = selectKeyObjectValueProc(key[0], key[1]);
          } else if (typeof key === "string" || typeof key === "number") {
            proc = selectKeyObjectValueProc(key, key);
          }
        } else {
          proc = defaultObjectValueFunc;
        }

        if ((0, _isLike.isArray)(obj)) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (proc(obj[i], value)) return getKey ? i : true;
          }
        } else {
          for (var objKey in obj) {
            if (obj.hasOwnProperty(objKey) && proc(obj[objKey], value)) return getKey ? objKey : true;
          }
        }
      }

      return getKey ? void 0 : false;
    };
  }();

  _exports.hasValue = hasValue;

  var getKeyBy = function getKeyBy(object, value) {
    if ((0, _isLike.isFunction)(value)) {
      if ((0, _isLike.isArray)(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (value(object[i], i) === true) return i;
      }
      if ((0, _isLike.isObject)(object)) for (var key in object) {
        if (value(object[key], key) === true) return key;
      }
    } else {
      if ((0, _isLike.isArray)(object)) for (var i = 0, l = object.length; i < l; i++) {
        if (object[i] === value) return i;
      }
      if ((0, _isLike.isObject)(object)) for (var key in object) {
        if (object[key] === value) return key;
      }
    }
  };

  _exports.getKeyBy = getKeyBy;

  var clearOf = function clearOf(data, fillFn, sp) {
    if (data instanceof Array) {
      sp = Array.prototype.splice.call(data, 0, data.length);
    } else if (typeof data == "object") {
      sp = {};

      for (var key in data) {
        sp[key] = data[key];
        delete data[key];
      }
    }

    return fillFn && fillFn(data, sp), data;
  };

  _exports.clearOf = clearOf;

  var insertOf = function insertOf(data, v, a) {
    (0, _isLike.isArray)(data) && data.splice(typeof a === "number" ? a : 0, 0, v);
    return data;
  };

  _exports.insertOf = insertOf;

  var moveOf = function moveOf(data, oldIndex, newIndex) {
    if (oldIndex !== newIndex && (0, _isLike.isArray)(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length) {
      Array.prototype.splice.call(data, newIndex > data.length ? data.length : newIndex, 0, Array.prototype.splice.call(data, oldIndex, 1)[0]);
    }

    return data;
  };

  _exports.moveOf = moveOf;

  var concatOf = function concatOf(data, appends) {
    var data = (0, _cast.asArray)(data);
    return (0, _cast.asArray)(appends).forEach(function (value) {
      data.push(value);
    }), data;
  };

  _exports.concatOf = concatOf;

  var filterOf = function filterOf(data, func, exitFn) {
    var data = (0, _cast.asArray)(data);
    var exitCnt = 0;

    for (var i = 0, ri = 0, keys = Object.keys(data), l = keys.length; i < l; i++, ri++) {
      var key = keys[i];
      var value = data[key];
      var result = func(value, key);

      if (result == false) {
        var exit = Array.prototype.splice.call(data, i, 1);
        i--;
        l--;
        typeof exitFn === "function" && exitFn(value, ri, exitCnt++);
      }
    }

    return data;
  };

  _exports.filterOf = filterOf;

  var sortOf = function sortOf(data, filter) {
    if (data.length == 0) {
      return data;
    }

    switch (filter) {
      case 'desc':
        filter = function filter(a, b) {
          return a > b;
        };

        break;

      case undefined:
      case 'asc':
      default:
        if (typeof filter !== "function") {
          filter = function filter(a, b) {
            return a < b;
          };
        }

        break;
    }

    var result = [data[0]];

    for (var i = 1, l = data.length; i < l; i++) {
      for (var ri = 0, rl = result.length; ri < rl; ri++) {
        if (filter(data[i], result[ri]) === true) {
          insertOf(result, data[i], ri);
          break;
        }

        if (ri + 1 === result.length) {
          result.push(data[i]);
        }
      }
    }

    clearOf(data);

    for (var i = 0, l = result.length; i < l; data.push(result[i]), i++) {
      ;
    }

    return data;
  };

  _exports.sortOf = sortOf;

  var rebase = function rebase(obj, ref) {
    var result = {};

    for (var key in obj) {
      if (key === ".*") {
        var refValue = obj[key];

        for (var i = 0, d = Object.keys(ref), l = d.length; i < l; i++) {
          var refKey = d[i];

          if (typeof refValue === "function") {
            result[refKey] = obj[key];
          } else {
            if (typeof refValue !== "object" && typeof refValue !== "object" || (0, _isLike.isNode)(refValue)) {
              result[refKey] = refValue;
            } else {
              result[refKey] = Object.assign(result[refKey], refValue);
            }
          }
        }
      } else if (key.indexOf(",") > -1) {
        key.split(",").forEach(function (deepKey) {
          deepKey = deepKey.trim();

          if (typeof obj[key] === "function") {
            result[deepKey] = obj[key];
          } else {
            if (!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object" || (0, _isLike.isNode)(obj[key])) {
              result[deepKey] = obj[key];
            } else {
              result[deepKey] = Object.assign(result[deepKey] || ((0, _isLike.isArray)(obj[key]) ? [] : {}), obj[key], obj[deepKey]);
            }
          }
        });
      } else {
        if (typeof obj[key] === "function") {
          result[key] = obj[key];
        } else {
          if (typeof result[key] !== "object" && typeof obj[key] !== "object" || (0, _isLike.isNode)(obj[key])) {
            result[key] = obj[key];
          } else {
            result[key] = Object.assign(result[key], obj[key]);
          }
        }
      }
    }

    return result;
  }; //TODO: Union hasValue


  _exports.rebase = rebase;

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

  var apart = function apart(text, split, block, blockEnd) {
    if (typeof text !== "string") return [text];
    var result = text.split(split === true ? /\s+/ : split || /\s+/);

    if ((0, _isLike.likeRegexp)(block)) {
      if (!(0, _isLike.likeRegexp)(blockEnd)) {
        blockEnd = block;
      }

      var aparts = [];
      var buffer = {
        dept: 0,
        parts: []
      };

      for (var d = result, i = 0, l = d.length; i < l; i++) {
        var part = d[i];
        var greb = {
          start: findIndexes(part, block),
          end: findIndexes(part, blockEnd)
        };
        console.log("part, greb", part, greb);

        for (var _d = greb.start, _i = 0, _l = _d.length; _i < _l; ++_i) {
          var startIndex = _d[_i];
        }
      }

      return aparts;
    } else {
      return result;
    }
  };

  _exports.apart = apart;

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
      keys: unique(afterKeys.concat(beforeKeys)).reduce(function (dest, key) {
        dest[key] = undefined;
        return dest;
      }, {}),
      match: [],
      missing: [],
      surplus: [],
      diff: [],
      pass: false
    }; //match, missing

    for (var ki in beforeKeys) {
      if (!beforeKeys.hasOwnProperty(ki)) continue;
      var key = beforeKeys[ki];

      if (NESTED_HAS_PROC(after, key)) {
        analysis.match.push(key);
        analysis.keys[key] = "match";

        if (canDiff && !angular.equals((0, _reducer.get)(after, key), (0, _reducer.get)(before, key))) {
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
  }; //PINPONGPOOL INTERFACE


  _exports.diffStructure = diffStructure;

  var toggle = function toggle(ta, cv, set) {
    var index = -1;

    for (var d = (0, _cast.asArray)(ta), _l2 = d.length, _i2 = 0; _i2 < _l2; _i2++) {
      if (d[_i2] == cv) {
        index = _i2 + 1;
        break;
      }
    }

    if (arguments.length > 2) for (var i = 0, l = ta.length; i < l; i++) {
      if (ta[i] == set) return ta[i];
    }
    index = ta.length == index ? 0 : index;
    return ta[index];
  };

  _exports.toggle = toggle;

  var turn = function turn(i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }

    ;
    ts = ts ? ts : 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  };

  _exports.turn = turn;
});
//# sourceMappingURL=functions.js.map
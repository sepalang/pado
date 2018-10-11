(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.match", "core-js/modules/es6.regexp.split", "core-js/modules/es6.object.assign", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.string.iterator", "core-js/modules/es6.set", "./isLike", "./cast", "./read"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.match"), require("core-js/modules/es6.regexp.split"), require("core-js/modules/es6.object.assign"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.string.iterator"), require("core-js/modules/es6.set"), require("./isLike"), require("./cast"), require("./read"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Regexp, global.es6Object, global.es6Object, global.webDom, global.es6Array, global.es6String, global.es6, global.isLike, global.cast, global.read);
    global.functions = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Regexp2, _es6Object, _es6Object2, _webDom, _es6Array, _es6String, _es, _isLike, _cast, _read) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.diffStructure = _exports.rebase = _exports.sortOf = _exports.insertOf = _exports.clearOf = _exports.filterOf = _exports.concatOf = _exports.moveOf = _exports.getKeyBy = _exports.unique = void 0;

  var unique = function unique(array, findKey) {
    var result = [];
    var uniqueSet = new Set();

    if (typeof findKey === "undefined") {
      findKey = function findKey(v) {
        return v;
      };
    }

    if (typeof findKey === "string") {
      var keyPath = findKey;

      findKey = function findKey(v) {
        return v[keyPath];
      };
    }

    array.forEach(function (v) {
      var key = findKey(v);
      if (uniqueSet.has(key)) return;
      uniqueSet.add(key);
      result.push(v);
    });
    return result;
  };

  _exports.unique = unique;

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
        /*
        var exit = Array.prototype.splice.call(data, i, 1)
        */
        i--;
        l--;
        typeof exitFn === "function" && exitFn(value, ri, exitCnt++);
      }
    }

    return data;
  };

  _exports.filterOf = filterOf;

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
//# sourceMappingURL=functions.js.map
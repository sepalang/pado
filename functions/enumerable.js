(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"), require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Object, global.webDom, global.isLike, global.cast);
    global.enumerable = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Object, _webDom, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.nested = _exports.deepForEach = _exports.pairs = _exports.hashMap = _exports.times = _exports.all = void 0;

  var all = function all(data, fn) {
    data = (0, _cast.asArray)(data);

    if (data.length === 0) {
      return false;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      if (!fn(data[i], i)) {
        return false;
      }
    }

    ;
    return true;
  };

  _exports.all = all;

  var times = function times(length, fn) {
    var result = [];

    for (var i = 0, l = length; i < l; i++) {
      result.push(fn(i));
    }

    return result;
  };

  _exports.times = times;

  var hashMap = function hashMap(object, fn) {
    if (typeof object === "object" && !(0, _isLike.isArray)(object)) for (var k in object) {
      object[k] = fn(object[k], k);
    } else return fn(object, void 0);
    return object;
  };

  _exports.hashMap = hashMap;

  var pairs = function pairs(inputArr, fn) {
    var result = [];

    for (var i = 0, l = inputArr.length; i < l; i++) {
      for (var ai = 0, al = l; ai < al; i !== ai && result.push([inputArr[i], inputArr[ai]]), ai++) {
        ;
      }
    }

    return typeof fn === "function" ? result.map(function (applyArgs) {
      return fn.apply(undefined, applyArgs);
    }) : result;
  };

  _exports.pairs = pairs;

  var deepForEach = function deepForEach(nsData, key, proc, startParam) {
    if (nsData && key && proc) {
      var nestedTreeDownProcess = function nestedTreeDownProcess(nested, key, proc, parentReturn, depth) {
        ++depth;
        var procIndex = 0;
        (0, _cast.asArray)(nested).forEach(function (data, forKey) {
          if ((0, _isLike.isArray)(data)) {
            data.length && nestedTreeDownProcess(data, key, proc, parentReturn, depth);
          } else {
            if ((0, _isLike.isArray)(nested) && (0, _isLike.isObject)(data) || (0, _isLike.isObject)(data) && forKey == key) {
              var destChilds = [];

              if (key === Object) {
                (0, _cast.asArray)(Object.keys(data)).forEach(function (ok) {
                  (0, _isLike.isArray)(data[ok]) && destChilds.push(data[ok]);
                });
              }

              typeof data[key] === "object" && destChilds.push(data[key]);
              var procReturn = proc(data, parentReturn, depth, procIndex++);
              (0, _cast.asArray)(destChilds).forEach(function (dest) {
                nestedTreeDownProcess(dest, key, proc, procReturn, depth);
              });
            }
          }
        });
      };

      if ((0, _isLike.isObject)(nsData) && !(0, _isLike.isArray)(nsData)) {
        var destChilds = [];
        key === Object && Object.keys(nsData).forEach(function (ok) {
          (0, _isLike.isArray)(nsData[ok]) && destChilds.push(nsData[ok]);
        });
        typeof nsData[key] === "object" && destChilds.push(nsData[key]);
        startParam = proc(nsData, startParam, 0);
        (0, _cast.asArray)(destChilds).forEach(function (dest) {
          nestedTreeDownProcess(dest, key, proc, startParam, 0);
        });
      } else {
        nestedTreeDownProcess(nsData, key, proc, startParam, -1);
      }

      return nsData;
    }
  };

  _exports.deepForEach = deepForEach;

  var nested = function nested(nsData, key, select, proc) {
    var result = [];
    var fineded = false;
    deepForEach(nsData, key, function (data, parentReturn, depth, index) {
      if (fineded) return;

      if (typeof select === "function" ? select(data, parentReturn, depth, index) : data === select) {
        fineded = true;
        return result = parentReturn.concat([data]);
      }

      return parentReturn.concat([data]);
    }, []);

    if (typeof proc === "function") {
      (0, _cast.asArray)(result).forEach(proc);
    }

    return result;
  };

  _exports.nested = nested;
});
//# sourceMappingURL=enumerable.js.map
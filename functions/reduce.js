require("core-js/modules/es6.array.fill");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.sort", "core-js/modules/es6.number.constructor", "./isLike", "./cast", "./read", "./reform"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.sort"), require("core-js/modules/es6.number.constructor"), require("./isLike"), require("./cast"), require("./read"), require("./reform"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Number, global.isLike, global.cast, global.read, global.reform);
    global.reduce = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Number, _isLike, _cast, _read, _reform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.top = _exports.cuts = _exports.cut = void 0;

  //reduce.spec.js
  var cut = function cut(collection, cutLength, emptyDefault, fullResult) {
    if (fullResult === void 0) {
      fullResult = false;
    }

    var data = (0, _cast.asArray)(collection);
    var rest;
    cutLength = (0, _isLike.isNumber)(cutLength) ? cutLength : 1;

    if (data.length > cutLength) {
      rest = data.splice(cutLength, Number.POSITIVE_INFINITY);
      return fullResult === true ? [data, rest] : data;
    }

    data = (0, _reform.fill)(data, cutLength, emptyDefault);
    return fullResult === true ? [data, []] : data;
  };

  _exports.cut = cut;

  var cuts = function cuts(collection, cutLength, emptyDefault) {
    var result = [];
    var rest = collection; //

    var rowIndex = 0;
    var enumFn = typeof emptyDefault !== "function" ? function () {
      return emptyDefault;
    } : function (index) {
      return emptyDefault(rowIndex * cutLength + index, index, rowIndex);
    };

    do {
      var _cut = cut(rest, cutLength, enumFn, true);

      collection = _cut[0];
      rest = _cut[1];
      result.push(collection);
      rowIndex++;
    } while (rest.length > 0);

    return result;
  }; //reduce.spec.js


  _exports.cuts = cuts;

  var top = function top(data, iteratee, topLength) {
    switch (typeof iteratee) {
      case "function":
        //iteratee=iteratee;
        break;

      case "string":
        var path = iteratee;

        iteratee = function iteratee(a, b) {
          return (0, _read.get)(a, path) < (0, _read.get)(b, path);
        };

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
//# sourceMappingURL=reduce.js.map
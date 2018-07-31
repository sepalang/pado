(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.sort", "core-js/modules/es6.number.constructor", "./reduce.base", "../isLike", "../cast", "../read"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.sort"), require("core-js/modules/es6.number.constructor"), require("./reduce.base"), require("../isLike"), require("../cast"), require("../read"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Number, global.reduce, global.isLike, global.cast, global.read);
    global.reduce = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Number, _reduce, _isLike, _cast, _read) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.top = _exports.cuts = _exports.cut = void 0;

  var cut = function cut(collection, cutLength, fillContent) {
    var useFill = arguments.length > 2;
    return (0, _reduce.baseCut)(collection, cutLength, fillContent, useFill)[0];
  };

  _exports.cut = cut;

  var cuts = function cuts(collection, cutLength, fillContent) {
    var result = [];
    var rest = collection;
    var rowIndex = 0;
    var enumFn = typeof fillContent !== "function" ? function () {
      return fillContent;
    } : function (index) {
      return fillContent(rowIndex * cutLength + index, index, rowIndex);
    };
    var useFill = arguments.length > 2;

    do {
      var _baseCut = (0, _reduce.baseCut)(rest, cutLength, enumFn, useFill);

      collection = _baseCut[0];
      rest = _baseCut[1];
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
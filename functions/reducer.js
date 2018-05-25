(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.sort", "core-js/modules/es6.number.constructor", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.sort"), require("core-js/modules/es6.number.constructor"), require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Number, global.isLike, global.cast);
    global.reducer = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Number, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.top = _exports.cut = void 0;

  //reducer.spec.js
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
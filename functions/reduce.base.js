require("core-js/modules/es6.array.fill");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.number.constructor", "./isLike", "./cast", "./reform"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.number.constructor"), require("./isLike"), require("./cast"), require("./reform"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Number, global.isLike, global.cast, global.reform);
    global.reduceBase = mod.exports;
  }
})(this, function (_exports, _es6Number, _isLike, _cast, _reform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.baseCut = void 0;

  var baseCut = function baseCut(collection, cutLength, emptyDefault, useFill) {
    var data = (0, _cast.asArray)(collection);
    var rest;
    cutLength = (0, _isLike.isNumber)(cutLength) ? cutLength : 1;

    if (data.length > cutLength) {
      rest = data.splice(cutLength, Number.POSITIVE_INFINITY);
      return [data, rest];
    }

    useFill === true && (data = (0, _reform.fill)(data, cutLength, emptyDefault));
    return [data, []];
  };

  _exports.baseCut = baseCut;
});
//# sourceMappingURL=reduce.base.js.map
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./cast", "./isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./cast"), require("./isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cast, global.isLike);
    global.reform = mod.exports;
  }
})(this, function (_exports, _cast, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.fill = void 0;

  var fill = function fill(collection, fillLength, emptyDefault) {
    if (emptyDefault === void 0) {
      emptyDefault = undefined;
    }

    var data = (0, _cast.asArray)(collection);
    var dataLength = data.length;
    fillLength = (0, _isLike.isNumber)(fillLength) ? fillLength : 0;
    var fillFn = typeof emptyDefault !== "function" ? function () {
      return emptyDefault;
    } : emptyDefault;

    for (var i = 0, l = fillLength - dataLength; i < l; data.push(fillFn(dataLength++, i++))) {
      ;
    }

    return collection;
  };

  _exports.fill = fill;
});
//# sourceMappingURL=reform.js.map
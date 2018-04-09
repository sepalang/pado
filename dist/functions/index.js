(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./functions.js", "./isLike", "./asTo", "./transform", "./enumerator", "./accurate", "./reducer", "./random", "./matrix"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./functions.js"), require("./isLike"), require("./asTo"), require("./transform"), require("./enumerator"), require("./accurate"), require("./reducer"), require("./random"), require("./matrix"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.functions, global.isLike, global.asTo, global.transform, global.enumerator, global.accurate, global.reducer, global.random, global.matrix);
    global.index = mod.exports;
  }
})(this, function (_functions, _isLike, _asTo, _transform, _enumerator, _accurate, _reducer, _random, _matrix) {
  "use strict";
});
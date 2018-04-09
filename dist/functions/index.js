(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./functions.js", "./isLike", "./asTo", "./transform", "./enumerator", "./reducer"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./functions.js"), require("./isLike"), require("./asTo"), require("./transform"), require("./enumerator"), require("./reducer"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.functions, global.isLike, global.asTo, global.transform, global.enumerator, global.reducer);
    global.index = mod.exports;
  }
})(this, function (_functions, _isLike, _asTo, _transform, _enumerator, _reducer) {
  "use strict";
});
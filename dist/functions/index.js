(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./functions.js", "./isLike", "./asTo", "./transform"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./functions.js"), require("./isLike"), require("./asTo"), require("./transform"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.functions, global.isLike, global.asTo, global.transform);
    global.index = mod.exports;
  }
})(this, function (_functions, _isLike, _asTo, _transform) {
  "use strict";
});
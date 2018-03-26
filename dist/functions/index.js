(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./functions.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./functions.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.functions);
    global.index = mod.exports;
  }
})(this, function (_functions) {
  "use strict";
});
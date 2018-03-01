(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['./functions'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('./functions'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.functions);
    global.timeline = mod.exports;
  }
})(this, function (_functions) {
  'use strict';
});
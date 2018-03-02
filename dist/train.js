(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['./modules/promise'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('./modules/promise'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.promise);
    global.train = mod.exports;
  }
})(this, function (_promise) {
  'use strict';

  var _promise2 = _interopRequireDefault(_promise);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});
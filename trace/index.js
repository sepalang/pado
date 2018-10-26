(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.index = mod.exports;
  }
})(this, function () {
  "use strict";

  module.exports = function (fn, name) {
    return function () {
      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      var result = fn.apply(void 0, params);
      var stack = '';

      try {
        throw new Error('pado/trace');
      } catch (e) {
        stack = e;
      }

      console.log("pado/watch --", {
        name: name,
        params: params,
        result: result,
        stack: stack.stack
      });
      return result;
    };
  };
});
//# sourceMappingURL=index.js.map
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./reduce"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./reduce"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.reduce);
    global.index = mod.exports;
  }
})(this, function (_exports, _reduce) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_reduce).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _reduce[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
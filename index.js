(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./functions", "./modules"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./functions"), require("./modules"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions, global.modules);
    global.index = mod.exports;
  }
})(this, function (_exports, _functions, _modules) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_functions).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _functions[key];
      }
    });
  });
  Object.keys(_modules).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _modules[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
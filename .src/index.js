require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._);
    global.index = mod.exports;
  }
})(this, function (_exports, _) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
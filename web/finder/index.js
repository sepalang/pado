require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./easy.js", "./finder.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./easy.js"), require("./finder.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.easy, global.finder);
    global.index = mod.exports;
  }
})(this, function (_exports, _easy, _finder) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_easy).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _easy[key];
      }
    });
  });
  Object.keys(_finder).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _finder[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
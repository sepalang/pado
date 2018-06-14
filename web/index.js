require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./env", "./helper"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./env"), require("./helper"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.env, global.helper);
    global.index = mod.exports;
  }
})(this, function (_exports, _env, _helper) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_env).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _env[key];
      }
    });
  });
  Object.keys(_helper).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _helper[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
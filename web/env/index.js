require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./window", "./storage", "./dom", "./url"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./window"), require("./storage"), require("./dom"), require("./url"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.window, global.storage, global.dom, global.url);
    global.index = mod.exports;
  }
})(this, function (_exports, _window, _storage, _dom, _url) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_window).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _window[key];
      }
    });
  });
  Object.keys(_storage).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _storage[key];
      }
    });
  });
  Object.keys(_dom).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _dom[key];
      }
    });
  });
  Object.keys(_url).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _url[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
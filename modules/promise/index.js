require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./promiseEngine.js", "./promise.js", "./promiseFunctions.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./promiseEngine.js"), require("./promise.js"), require("./promiseFunctions.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promiseEngine, global.promise, global.promiseFunctions);
    global.index = mod.exports;
  }
})(this, function (_exports, _promiseEngine, _promise, _promiseFunctions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    resolve: true,
    reject: true,
    all: true
  };
  Object.defineProperty(_exports, "resolve", {
    enumerable: true,
    get: function get() {
      return _promiseEngine.resolve;
    }
  });
  Object.defineProperty(_exports, "reject", {
    enumerable: true,
    get: function get() {
      return _promiseEngine.reject;
    }
  });
  Object.defineProperty(_exports, "all", {
    enumerable: true,
    get: function get() {
      return _promiseEngine.all;
    }
  });
  Object.keys(_promise).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _promise[key];
      }
    });
  });
  Object.keys(_promiseFunctions).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _promiseFunctions[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
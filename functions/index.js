require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./functions", "./isLike", "./cast", "./enumerable", "./accurate", "./reducer", "./random", "./matrix", "./datetime", "./nice", "./shadow"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./functions"), require("./isLike"), require("./cast"), require("./enumerable"), require("./accurate"), require("./reducer"), require("./random"), require("./matrix"), require("./datetime"), require("./nice"), require("./shadow"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions, global.isLike, global.cast, global.enumerable, global.accurate, global.reducer, global.random, global.matrix, global.datetime, global.nice, global.shadow);
    global.index = mod.exports;
  }
})(this, function (_exports, _functions, _isLike, _cast, _enumerable, _accurate, _reducer, _random, _matrix, _datetime, _nice, _shadow) {
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
  Object.keys(_isLike).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _isLike[key];
      }
    });
  });
  Object.keys(_cast).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _cast[key];
      }
    });
  });
  Object.keys(_enumerable).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _enumerable[key];
      }
    });
  });
  Object.keys(_accurate).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _accurate[key];
      }
    });
  });
  Object.keys(_reducer).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _reducer[key];
      }
    });
  });
  Object.keys(_random).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _random[key];
      }
    });
  });
  Object.keys(_matrix).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _matrix[key];
      }
    });
  });
  Object.keys(_datetime).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _datetime[key];
      }
    });
  });
  Object.keys(_nice).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _nice[key];
      }
    });
  });
  Object.keys(_shadow).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _shadow[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
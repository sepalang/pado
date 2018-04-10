(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./functions", "./isLike", "./transform", "./enumerator", "./accurate", "./reducer", "./random", "./matrix", "./datetime"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./functions"), require("./isLike"), require("./transform"), require("./enumerator"), require("./accurate"), require("./reducer"), require("./random"), require("./matrix"), require("./datetime"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions, global.isLike, global.transform, global.enumerator, global.accurate, global.reducer, global.random, global.matrix, global.datetime);
    global.index = mod.exports;
  }
})(this, function (_exports, _functions, _isLike, _transform, _enumerator, _accurate, _reducer, _random, _matrix, _datetime) {
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
  Object.keys(_transform).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _transform[key];
      }
    });
  });
  Object.keys(_enumerator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _enumerator[key];
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
});
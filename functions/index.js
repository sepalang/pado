require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./cast", "./castString", "./enumerable", "./reduce", "./random", "./matrix", "./datetime", "./nice", "./remark", "./read", "./hack", "./draw", "./reform"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./cast"), require("./castString"), require("./enumerable"), require("./reduce"), require("./random"), require("./matrix"), require("./datetime"), require("./nice"), require("./remark"), require("./read"), require("./hack"), require("./draw"), require("./reform"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.cast, global.castString, global.enumerable, global.reduce, global.random, global.matrix, global.datetime, global.nice, global.remark, global.read, global.hack, global.draw, global.reform);
    global.index = mod.exports;
  }
})(this, function (_exports, _isLike, _cast, _castString, _enumerable, _reduce, _random, _matrix, _datetime, _nice, _remark, _read, _hack, _draw, _reform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
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
  Object.keys(_castString).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _castString[key];
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
  Object.keys(_reduce).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _reduce[key];
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
  Object.keys(_remark).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _remark[key];
      }
    });
  });
  Object.keys(_read).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _read[key];
      }
    });
  });
  Object.keys(_hack).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _hack[key];
      }
    });
  });
  Object.keys(_draw).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _draw[key];
      }
    });
  });
  Object.keys(_reform).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _reform[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
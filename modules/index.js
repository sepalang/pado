require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./promise", "./block", "./decorator", "./operate", "./session", "./ranger", "./stance", "./affect", "./matrix"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./promise"), require("./block"), require("./decorator"), require("./operate"), require("./session"), require("./ranger"), require("./stance"), require("./affect"), require("./matrix"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promise, global.block, global.decorator, global.operate, global.session, global.ranger, global.stance, global.affect, global.matrix);
    global.index = mod.exports;
  }
})(this, function (_exports, _promise, _block, _decorator, _operate, _session, _ranger, _stance, _affect, _matrix) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    promise: true
  };
  Object.defineProperty(_exports, "promise", {
    enumerable: true,
    get: function get() {
      return _promise.promise;
    }
  });
  Object.keys(_block).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _block[key];
      }
    });
  });
  Object.keys(_decorator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _decorator[key];
      }
    });
  });
  Object.keys(_operate).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _operate[key];
      }
    });
  });
  Object.keys(_session).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _session[key];
      }
    });
  });
  Object.keys(_ranger).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _ranger[key];
      }
    });
  });
  Object.keys(_stance).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _stance[key];
      }
    });
  });
  Object.keys(_affect).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _affect[key];
      }
    });
  });
  Object.keys(_matrix).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _matrix[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
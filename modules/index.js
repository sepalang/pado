(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./block", "./editable", "./makeup", "./paginate", "./promise", "./timeline"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./block"), require("./editable"), require("./makeup"), require("./paginate"), require("./promise"), require("./timeline"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.block, global.editable, global.makeup, global.paginate, global.promise, global.timeline);
    global.index = mod.exports;
  }
})(this, function (_exports, _block, _editable, _makeup, _paginate, _promise, _timeline) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_block).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _block[key];
      }
    });
  });
  Object.keys(_editable).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _editable[key];
      }
    });
  });
  Object.keys(_makeup).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _makeup[key];
      }
    });
  });
  Object.keys(_paginate).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _paginate[key];
      }
    });
  });
  Object.keys(_promise).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _promise[key];
      }
    });
  });
  Object.keys(_timeline).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _timeline[key];
      }
    });
  });
});
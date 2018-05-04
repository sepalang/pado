(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./block", "./editable", "./makeup", "./paginate", "./promise", "./timeline", "./operate", "./session"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./block"), require("./editable"), require("./makeup"), require("./paginate"), require("./promise"), require("./timeline"), require("./operate"), require("./session"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.block, global.editable, global.makeup, global.paginate, global.promise, global.timeline, global.operate, global.session);
    global.index = mod.exports;
  }
})(this, function (_exports, _block, _editable, _makeup, _paginate, _promise, _timeline, _operate, _session) {
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
  Object.keys(_editable).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _editable[key];
      }
    });
  });
  Object.keys(_makeup).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _makeup[key];
      }
    });
  });
  Object.keys(_paginate).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _paginate[key];
      }
    });
  });
  Object.keys(_timeline).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _timeline[key];
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
});
//# sourceMappingURL=index.js.map
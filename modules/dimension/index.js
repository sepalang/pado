require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./baseDimenstion", "./position"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./baseDimenstion"), require("./position"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.baseDimenstion, global.position);
    global.index = mod.exports;
  }
})(this, function (_exports, _baseDimenstion, _position) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_baseDimenstion).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _baseDimenstion[key];
      }
    });
  });
  Object.keys(_position).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _position[key];
      }
    });
  });
});
//# sourceMappingURL=index.js.map
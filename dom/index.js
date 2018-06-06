require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/web.dom.iterable");

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./helper/dragHelper", "./helper/repeatHelper", "./math/draw"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./helper/dragHelper"), require("./helper/repeatHelper"), require("./math/draw"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.dragHelper, global.repeatHelper, global.draw);
    global.index = mod.exports;
  }
})(this, function (_exports, _dragHelper2, _repeatHelper2, _draw) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    dragHelper: true,
    repeatHelper: true
  };
  _exports.repeatHelper = _exports.dragHelper = void 0;
  _dragHelper2 = _interopRequireDefault(_dragHelper2);
  _repeatHelper2 = _interopRequireDefault(_repeatHelper2);
  Object.keys(_draw).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _draw[key];
      }
    });
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var dragHelper = _dragHelper2.default;
  _exports.dragHelper = dragHelper;
  var repeatHelper = _repeatHelper2.default;
  _exports.repeatHelper = repeatHelper;
});
//# sourceMappingURL=index.js.map
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./dragHelper", "./repeatHelper"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./dragHelper"), require("./repeatHelper"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.dragHelper, global.repeatHelper);
    global.index = mod.exports;
  }
})(this, function (_exports, _dragHelper2, _repeatHelper2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.repeatHelper = _exports.dragHelper = void 0;
  _dragHelper2 = _interopRequireDefault(_dragHelper2);
  _repeatHelper2 = _interopRequireDefault(_repeatHelper2);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var dragHelper = _dragHelper2.default;
  _exports.dragHelper = dragHelper;
  var repeatHelper = _repeatHelper2.default;
  _exports.repeatHelper = repeatHelper;
});
//# sourceMappingURL=index.js.map
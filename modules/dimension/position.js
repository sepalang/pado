(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "./baseDimenstion"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("./baseDimenstion"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6Array, global.es6Object, global.baseDimenstion);
    global.position = mod.exports;
  }
})(this, function (_exports, _webDom, _es6Array, _es6Object, _baseDimenstion) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rectWithRect = void 0;

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

  var rectWithRect = function rectWithRect(_ref2, _ref, position) {
    var refX = _ref2.left,
        refY = _ref2.top,
        refWidth = _ref2.width,
        refHeight = _ref2.height;

    var _ref$left = _ref.left,
        left = _ref$left === void 0 ? 0 : _ref$left,
        _ref$top = _ref.top,
        top = _ref$top === void 0 ? 0 : _ref$top,
        width = _ref.width,
        height = _ref.height,
        targetProps = _objectWithoutProperties(_ref, ["left", "top", "width", "height"]);

    switch (position) {
      case "center":
        return (0, _baseDimenstion.rect)(_objectSpread({
          left: refX + refWidth / 2 - width / 2,
          top: refY + refHeight / 2 - height / 2,
          width: width,
          height: height
        }, targetProps));

      default:
        return (0, _baseDimenstion.rect)(_objectSpread({
          left: left,
          top: top,
          width: width,
          height: height
        }, targetProps));
    }
  };

  _exports.rectWithRect = rectWithRect;
});
//# sourceMappingURL=position.js.map
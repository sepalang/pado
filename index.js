(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./functions/functions.js", "./modules/promise.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("./functions/functions.js"), require("./modules/promise.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.functions, global.promise);
    global.index = mod.exports;
  }
})(this, function (functions, _promise) {
  "use strict";

  functions = _interopRequireWildcard(functions);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  module.exports = _objectSpread({}, functions, {
    promise: _promise.promise
  });
});
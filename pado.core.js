(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/es6.function.name", "./index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/es6.function.name"), require("./index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6Array, global.es6Object, global.es6Function, global.index);
    global.padoCore = mod.exports;
  }
})(this, function (_exports, _webDom, _es6Array, _es6Object, _es6Function, functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.factory = void 0;
  functions = _interopRequireWildcard(functions);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var Bow = function Bow() {};

  var BowFactory = function BowFactory(fns) {
    var BOX = function BOX(payload) {
      return new Bow(payload);
    };

    function applyBoxFns(BowFns) {
      for (var name in BowFns) {
        BOX[name] = BowFns[name];
      }
    }

    applyBoxFns(fns);
    return BOX;
  };

  var DEFAULT = BowFactory(_objectSpread({}, functions));
  var factory = BowFactory;
  _exports.factory = factory;
  var _default = DEFAULT;
  _exports.default = _default;
});
//# sourceMappingURL=pado.core.js.map
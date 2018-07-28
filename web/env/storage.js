(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Object, global.webDom);
    global.storage = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Object, _webDom) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getLocalData = _exports.setLocalData = void 0;

  var toDataString = function toDataString(tods) {
    switch (typeof tods) {
      case "string":
        return "\"" + tods + "\"";

      case "object":
        return JSON.stringify(tods);

      case "boolean":
      case "undefined":
      case "number":
      default:
        return "" + tods;
    }
  };

  var fromDataString = function fromDataString(v) {
    // eslint-disable-next-line no-eval
    return eval("(" + v + ")");
  }; //로컬스토리지 데이터 저장


  var setLocalData = function setLocalData(k, v) {
    var localStorage = window.localStorage;

    if (typeof k === "object") {
      Object.keys(k).forEach(function (key) {
        localStorage.setItem(key, toDataString(k[key]));
      });
    } else {
      localStorage.setItem(k, toDataString(v));
    }

    return true;
  }; //로컬스토리지 데이터 불러오기


  _exports.setLocalData = setLocalData;

  var getLocalData = function getLocalData(k) {
    var localStorage = window.localStorage;
    if (!arguments.length) return localStorage;
    var stringData = localStorage.getItem(k);
    return stringData == null ? undefined : fromDataString(stringData);
  };

  _exports.getLocalData = getLocalData;
});
//# sourceMappingURL=storage.js.map
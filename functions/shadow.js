(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"), require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Object, global.webDom, global.isLike, global.cast);
    global.shadow = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Object, _webDom, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.deepEntries = _exports.keys = _exports.entries = void 0;

  var entries = function entries(it) {
    var result = [];

    switch (typeof it) {
      case "object":
        (0, _isLike.isNone)(it) ? 0 : (0, _isLike.likeArray)(it) ? (0, _cast.asArray)(it).forEach(function (v, k) {
          result.push([k, v]);
        }) : Object.keys(it).forEach(function (key) {
          result.push([key, it[key]]);
        });
        break;
    }

    return result;
  };

  _exports.entries = entries;

  var keys = function keys(target, filterExp) {
    var result = [];
    var filter = typeof filterExp === "function" ? filterExp : function () {
      return true;
    };
    (0, _isLike.likeArray)(target) && Object.keys(target).filter(function (key) {
      !(0, _isLike.isAbsoluteNaN)(key) && filter(key, target) && result.push(parseInt(key, 10));
    }) || (0, _isLike.likeObject)(target) && Object.keys(target).forEach(function (key) {
      filter(key, target) && result.push(key);
    });
    return result;
  };

  _exports.keys = keys;

  var deepEntries = function deepEntries(target, filter) {
    if ((0, _isLike.likeArray)(target)) {}

    if ((0, _isLike.likeObject)(target)) {}
  };

  _exports.deepEntries = deepEntries;
});
//# sourceMappingURL=shadow.js.map
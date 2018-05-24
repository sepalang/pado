(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6Array, global.es6Object, global.cast);
    global.enumerable = mod.exports;
  }
})(this, function (_exports, _webDom, _es6Array, _es6Object, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.forMap = _exports.times = _exports.deep = _exports.all = void 0;

  var all = function all(data, fn) {
    data = (0, _cast.asArray)(data);

    if (data.length === 0) {
      return false;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      if (!fn(data[i], i)) {
        return false;
      }
    }

    ;
    return true;
  };

  _exports.all = all;

  var deep = function deep(data) {};

  _exports.deep = deep;

  var times = function times(length, fn) {
    var result = [];

    for (var i = 0, l = length; i < l; i++) {
      result.push(fn(i));
    }

    return result;
  };

  _exports.times = times;

  var forMap = function forMap(object, fn) {
    return Object.keys(object).reduce(function (dest, key) {
      dest[key] = fn(object[key], key);
      return dest;
    }, object);
  };

  _exports.forMap = forMap;
});
//# sourceMappingURL=enumerable.js.map
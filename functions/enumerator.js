(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./transform"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./transform"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.transform);
    global.enumerator = mod.exports;
  }
})(this, function (_exports, _transform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.times = _exports.all = void 0;

  var all = function all(data, fn) {
    data = (0, _transform.asArray)(data);

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

  var times = function times(length, fn) {
    var result = [];

    for (var i = 0, l = length; i < l; i++) {
      result.push(fn(i));
    }

    return result;
  };

  _exports.times = times;
});
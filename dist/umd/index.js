(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './functions/functions.js', './modules/promise.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./functions/functions.js'), require('./modules/promise.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.functions, global.promise);
    global.index = mod.exports;
  }
})(this, function (module, _functions, _promise) {
  'use strict';

  var functions = _interopRequireWildcard(_functions);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  module.exports = _extends({}, functions, {
    promise: _promise.promise
  });
});
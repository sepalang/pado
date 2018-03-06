(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './pado.core.js', './index.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./pado.core.js'), require('./index.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.padoCore, global.index);
    global.pado = mod.exports;
  }
})(this, function (exports, _padoCore, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var functions = _interopRequireWildcard(_index);

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

  var DEFAULT = (0, _padoCore.factory)(_extends({}, functions));

  exports.default = DEFAULT;
});
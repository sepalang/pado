(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './train.core.js', './index.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./train.core.js'), require('./index.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.trainCore, global.index);
    global.trainman = mod.exports;
  }
})(this, function (exports, _trainCore, _index) {
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

  var DEFAULT = (0, _trainCore.factory)(Object.assign({}, functions));

  exports.default = DEFAULT;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './index.js'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./index.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.trainCore = mod.exports;
  }
})(this, function (exports, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.factory = undefined;

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

  var DEFAULT = BowFactory(Object.assign({}, functions));

  var factory = exports.factory = BowFactory;
  exports.default = DEFAULT;
});
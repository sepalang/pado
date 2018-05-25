(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6Array, global.es6Object, global.isLike, global.cast);
    global.shadow = mod.exports;
  }
})(this, function (_exports, _webDom, _es6Array, _es6Object, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.deepKeys = _exports.entries = _exports.keys = void 0;

  var keys = function keys(target, filterExp, strict) {
    var result = [];
    if (!(0, _isLike.likeObject)(target)) return result;
    var filter = typeof filterExp === "function" ? filterExp : function () {
      return true;
    };
    (strict === true ? (0, _isLike.isArray)(target) : (0, _isLike.likeArray)(target)) && Object.keys(target).filter(function (key) {
      if (isNaN(key)) return;
      var numberKey = parseInt(key, 10);
      filter(numberKey, target) && result.push(parseInt(numberKey, 10));
    }) || (strict === true ? (0, _isLike.isPlainObject)(target) : (0, _isLike.likeObject)(target)) && Object.keys(target).forEach(function (key) {
      filter(key, target) && result.push(key);
    });
    return result;
  };

  _exports.keys = keys;

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

  var deepKeys = function () {
    var nestedDeepKeys = function nestedDeepKeys(target, filter, scope, total) {
      if (typeof target === "object") {
        keys(target, function (key, target) {
          var child = target[key];
          var useKey = filter(child, key, scope.length);

          if (!useKey) {
            return;
          }

          var currentScope = (0, _cast.clone)(scope);
          currentScope.push(key);
          total.push(currentScope);
          nestedDeepKeys(child, filter, currentScope, total);
        }, true);
      }
    };

    return function (target, filter) {
      var result = [];
      nestedDeepKeys(target, filter ? filter(child, key) : function () {
        return true;
      }, [], result);
      return result;
    };
  }();

  _exports.deepKeys = deepKeys;
});
//# sourceMappingURL=shadow.js.map
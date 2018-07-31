(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./promiseEngine", "../../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./promiseEngine"), require("../../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promiseEngine, global.functions);
    global.promise = mod.exports;
  }
})(this, function (_exports, _promiseEngine, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.promise = _exports.valueOf = _exports.timeout = _exports.defer = void 0;

  var defer = function defer() {
    var resolve, reject;
    var promise = new _promiseEngine.PromiseClass(function () {
      resolve = arguments[0];
      reject = arguments[1];
    });
    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    };
  };

  _exports.defer = defer;
  _promiseEngine.promise.defer = defer;

  var timeout = function timeout(fn, time) {
    if (typeof fn === "number") {
      return (0, _promiseEngine.newPromise)(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, fn);
      });
    } else {
      return (0, _promiseEngine.newPromise)(function (resolve) {
        return setTimeout(function () {
          return resolve(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };

  _exports.timeout = timeout;
  _promiseEngine.promise.timeout = timeout;

  var valueOf = function valueOf(maybeQ) {
    return (0, _promiseEngine.newPromise)(function (resolve, reject) {
      (0, _functions.likePromise)(maybeQ) ? maybeQ.then(resolve).catch(reject) : resolve(maybeQ);
    });
  };

  _exports.valueOf = valueOf;
  _promiseEngine.promise.valueOf = valueOf;
  var promise = _promiseEngine.promise;
  _exports.promise = promise;
});
//# sourceMappingURL=promise.js.map
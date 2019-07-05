(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions);
    global.promiseEngine = mod.exports;
  }
})(this, function (_exports, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.reject = _exports.resolve = _exports.all = _exports.promise = _exports.newPromise = _exports.PromiseClass = void 0;
  var PromiseClass = Promise;
  _exports.PromiseClass = PromiseClass;
  var resolveFn = PromiseClass.resolve;
  var rejectFn = PromiseClass.reject;

  var newPromise = function newPromise(fn) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      (0, _functions.likePromise)(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  };

  _exports.newPromise = newPromise;

  var promise = function promise(fn) {
    return newPromise(fn);
  };

  _exports.promise = promise;
  var PromiseFunction = promise;
  var all = Promise.all;
  _exports.all = all;
  PromiseFunction.all = all;
  var resolve = resolveFn;
  _exports.resolve = resolve;
  PromiseFunction.resolve = resolve;
  var reject = rejectFn;
  _exports.reject = reject;
  PromiseFunction.reject = reject;
});
//# sourceMappingURL=promiseEngine.js.map
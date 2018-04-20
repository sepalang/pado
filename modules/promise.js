(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.promise", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.promise"), require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6, global.functions);
    global.promise = mod.exports;
  }
})(this, function (_exports, _webDom, _es, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.wheel = _exports.defer = _exports.abort = _exports.valueOf = _exports.timeout = _exports.reject = _exports.resolve = _exports.all = _exports.promise = void 0;
  var PromiseClass = Promise;

  var isMaybePromise = function isMaybePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
  };

  var resolveFn = PromiseClass.resolve;
  var rejectFn = PromiseClass.reject;

  var PromiseFunction = function PromiseFunction(fn) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      isMaybePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  };

  var promise = PromiseFunction;
  _exports.promise = promise;
  var all = PromiseFunction.all = Promise.all;
  _exports.all = all;
  var resolve = PromiseFunction.resolve = resolveFn;
  _exports.resolve = resolve;
  var reject = PromiseFunction.reject = rejectFn;
  _exports.reject = reject;

  var timeout = PromiseFunction.timeout = function (fn, time) {
    if (typeof fn === "number") {
      return PromiseFunction(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, fn);
      });
    } else {
      return PromiseFunction(function (resolve) {
        return setTimeout(function () {
          return resolve(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };

  _exports.timeout = timeout;

  var valueOf = PromiseFunction.valueOf = function (maybeQ) {
    return PromiseFunction(function (resolve, reject) {
      isMaybePromise(maybeQ) ? maybeQ.then(resolve).catch(reject) : resolve(maybeQ);
    });
  };

  _exports.valueOf = valueOf;
  var abortMessage = new function () {
    Object.defineProperty(this, "message", {
      get: function get() {
        return ":abort";
      }
    });
    Object.defineProperty(this, "abort", {
      get: function get() {
        return true;
      }
    });
  }();

  var abort = PromiseFunction.abort = function (notifyConsole) {
    if (notifyConsole === void 0) {
      notifyConsole = undefined;
    }

    return new PromiseClass(function (resolve, reject) {
      if (notifyConsole === true) {
        console.warn("abort promise");
      }

      reject(abortMessage);
    });
  };

  _exports.abort = abort;

  var defer = PromiseFunction.defer = function () {
    var resolve, reject;
    var promise = new PromiseClass(function () {
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

  var wheel = PromiseFunction.wheel = function (tasks, option) {
    if (!(tasks instanceof Array)) {
      return PromiseFunction.reject(new Error("tasks must be array"));
    }

    if (!tasks.length || !tasks.some(function (e) {
      return typeof e === "function";
    })) {
      return PromiseFunction.reject(new Error("not found wheel executable"));
    }

    if (!tasks.some(function (e) {
      return typeof e !== "function" || typeof e !== "number";
    })) {
      return PromiseFunction.reject(new Error("wheel task only function or number executable"));
    }

    if (typeof option !== "object") {
      option = {};
    }

    var finished = false;
    var defer = PromiseFunction.defer();
    var limit = typeof option.limit === "number" && option.limit > 0 ? parseInt(option.limit, 10) : 10000;
    var taskLength = tasks.length;
    var wheelTick = 0;
    var resetScope = 0;

    var nextWheelTick = function nextWheelTick(tick, value, tickScope) {
      var nowAction = tasks[turn(tick, taskLength, 1)];

      var isActiveFn = function isActiveFn() {
        return tickScope === resetScope;
      };

      var nextTickFn = function nextTickFn(passValue) {
        // if reset called
        if (!isActiveFn()) return; // if over tick

        if (wheelTick > limit) {
          return defer.reject(new Error("limit"));
        }

        if (finished === false) {
          nextWheelTick(wheelTick++, passValue, tickScope);
        }
      };

      if (typeof nowAction === "function") {
        nowAction({
          value: value,
          next: nextTickFn,
          isActive: isActiveFn,
          resolve: defer.resolve,
          reject: defer.reject
        }, Math.floor(tick / tasks.length), tick);
      } else if (typeof nowAction === "number") {
        setTimeout(function () {
          nextTickFn(value);
        }, nowAction);
      }
    };

    defer.promise.then(function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    }).catch(function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    });

    defer.stop = function (resetTick) {
      finished = null;
      resetScope += 1;
    };

    defer.start = function (resetTick) {
      if (finished === null) {
        finished = false;
        wheelTick = typeof resetTick === "number" ? resetTick : 0;
        nextWheelTick(wheelTick++, option.value, resetScope);
      }
    };

    defer.reset = function (resetTick) {
      defer.stop();
      defer.start(resetTick);
    };

    defer.reset(0);
    return defer;
  };

  _exports.wheel = wheel;
});
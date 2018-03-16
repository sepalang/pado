(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.functions);
    global.promise = mod.exports;
  }
})(this, function (module, _functions) {
  "use strict";

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

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var PromiseFunction = function (PromiseClass) {
    return function (fn) {
      return new PromiseClass(fn);
    };
  }(Promise);

  var PromiseExports = {};

  PromiseExports.all = Promise.all;
  PromiseExports.resolve = Promise.resolve;
  PromiseExports.reject = Promise.reject;
  PromiseExports.timeout = function (fn, time) {
    if (typeof fn === "number") {
      return q(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, fn);
      });
    } else {
      return q(function (resolve) {
        return setTimeout(function () {
          return resolve(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };

  PromiseExports.valueOf = function (maybeQ) {
    return q(function (resolve, reject) {
      (typeof maybeQ === "undefined" ? "undefined" : _typeof(maybeQ)) === "object" && maybeQ !== null && maybeQ.then ? maybeQ.then(resolve).catch(reject) : resolve(maybeQ);
    });
  };

  PromiseExports.abort = function () {
    var notifyConsole = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

    return new PromiseClass(function (resolve, reject) {
      if (notifyConsole === true) {
        console.warn("break promise");
      }
      reject(abortMessage);
    });
  };

  PromiseExports.defer = function () {
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

  PromiseExports.wheel = function (tasks, option) {

    if (!(tasks instanceof Array)) {
      return q.reject(new Error("tasks must be array"));
    }

    if (!tasks.length || !tasks.some(function (e) {
      return typeof e === "function";
    })) {
      return q.reject(new Error("not found wheel executable"));
    }

    if (!tasks.some(function (e) {
      return typeof e !== "function" || typeof e !== "number";
    })) {
      return q.reject(new Error("wheel task only function or number executable"));
    }

    if ((typeof option === "undefined" ? "undefined" : _typeof(option)) !== "object") {
      option = {};
    }

    var finished = false;
    var defer = q.defer();
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
        if (!isActiveFn()) return;
        // if over tick
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
      if (finished === null) return q.abort();
      finished = true;
      return e;
    }).catch(function (e) {
      if (finished === null) return q.abort();
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

  Object.keys(PromiseExports).forEach(function (key) {
    PromiseFunction[key] = PromiseExports[key];
  });

  module.exports = _extends({}, PromiseExports, {
    promise: PromiseFunction
  });
});
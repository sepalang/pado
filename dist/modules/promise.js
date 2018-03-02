(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.functions);
    global.promise = mod.exports;
  }
})(this, function (exports, _functions) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  exports.default = function (PromiseClass) {
    var q = function q(fn) {
      return new PromiseClass(fn);
    };

    q.all = Promise.all;
    q.resolve = Promise.resolve;
    q.reject = Promise.reject;

    q.timeout = function (fn, time) {
      if (typeof fn === "number") {
        //fn => time, time => result
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

    q.valueOf = function (maybeQ) {
      return q(function (resolve, reject) {
        (typeof maybeQ === "undefined" ? "undefined" : _typeof(maybeQ)) === "object" && maybeQ !== null && maybeQ.then ? maybeQ.then(resolve).catch(reject) : resolve(maybeQ);
      });
    };

    q.break = function (notifyConsole) {
      return new PromiseClass(function (e) {
        if (notifyConsole === true) {
          console.warn("break promise", e);
        }
      });
    };

    q.timeoutTest = function (time) {
      return function (value) {
        return promise(function (resolve) {
          setTimeout(function (e) {
            return resolve(value);
          }, time);
        });
      };
    };

    q.defer = function () {
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

    q.wheel = function (tasks, option) {

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
      var limit = typeof option.limit === "number" && option.limit > 0 ? parseInt(option.limit) : 10000;
      var taskLength = tasks.length;
      var wheelTick = 0;
      var resetScope = 0;

      defer.promise.then(function (e) {
        if (finished === null) return q.break();
        finished = true;
        return e;
      }).catch(function (e) {
        if (finished === null) return q.break();
        finished = true;
        return e;
      });

      defer.stop = function () {
        finished = null;
      };

      defer.reset = function (resetTick) {
        resetScope += 1;
        wheelTick = typeof resetTick === "number" ? resetTick : 0;
        finished = false;
        nextWheelTick(wheelTick++, option.value, resetScope);
      };

      var nextWheelTick = function nextWheelTick(tick, value, tickScope) {
        var nowAction = tasks[turn(tick, taskLength, 1)];

        var nextTickFn = function nextTickFn(passValue) {
          //if reset called
          if (tickScope !== resetScope) return;
          //if over tick
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
            resolve: defer.resolve,
            reject: defer.reject,
            next: nextTickFn
          }, Math.floor(tick / tasks.length), tick);
        } else if (typeof nowAction === "number") {
          setTimeout(function () {
            nextTickFn(value);
          }, nowAction);
        }
      };

      defer.reset(0);

      return defer;
    };

    q.sequance = function (data, fn, serialPipeOutMode) {
      if (typeof fn === "undefined") {
        fn = function fn(datum) {
          if (typeof datum === "function") {
            return q(datum);
          }
        };
      }

      return q(function (resolve, reject) {
        data = (0, _functions.asArray)(data);

        if (typeof serialPipeOutMode === "undefined") {
          serialPipeOutMode = typeof data[0] === "function";
        }

        var resolveResult = [];
        var index = 0;
        var nextFn = function nextFn(beforeResolved) {
          if (index < data.length) {
            var fnResult;
            if (serialPipeOutMode) {
              var serialPipeOutModeFunc = data[index++];
              if (typeof serialPipeOutModeFunc === "function") {
                fnResult = serialPipeOutModeFunc(beforeResolved, index, data.length);
              } else {
                fnResult = serialPipeOutModeFunc;
              }
            } else {
              fnResult = fn(data[index++], index - 1);
            }

            q.valueOf(fnResult).then(function (r) {
              if (r === q.break) return;
              resolveResult.push(r), nextFn(r);
            }).catch(function (reason) {
              if (!serialPipeOutMode && reason instanceof Error) {
                reason["success"] = data.slice(index - 1);
              }
              reject(reason);
            });
          } else {
            return resolve(serialPipeOutMode ? beforeResolved : resolveResult);
          }
        };
        nextFn(fn);
      });
    };

    return q;
  }(Promise);
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "regenerator-runtime/runtime", "core-js/modules/es6.array.fill", "core-js/modules/es6.string.repeat", "core-js/modules/web.dom.iterable", "core-js/modules/es6.promise", "../functions", "./operate"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("regenerator-runtime/runtime"), require("core-js/modules/es6.array.fill"), require("core-js/modules/es6.string.repeat"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.promise"), require("../functions"), require("./operate"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.runtime, global.es6Array, global.es6String, global.webDom, global.es6, global.functions, global.operate);
    global.promise = mod.exports;
  }
})(this, function (_exports, _runtime, _es6Array, _es6String, _webDom, _es, _functions, _operate) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.sequance = _exports.wheel = _exports.defer = _exports.abort = _exports.valueOf = _exports.timeout = _exports.reject = _exports.resolve = _exports.all = _exports.promise = void 0;

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

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

  var sequance = PromiseFunction.sequance = function (funcArray, opts) {
    return q(function (resolve, reject) {
      var option = (0, _functions.asObject)(opts, "concurrent");

      if (option.concurrent === true) {
        option.concurrent = Number.POSITIVE_INFINITY;
      } else if (!(0, _functions.isNumber)(option.concurrent) || option.concurrent < 1) {
        option.concurrent = 1;
      }

      if (!(0, _functions.isNumber)(option.interval) || option.interval < -1) {
        option.interval = -1;
      }

      if (!(0, _functions.isNumber)(option.repeat) || option.repeat < 1) {
        option.repeat = 1;
      } //set task with repeat


      var sequanceTaskEntries = Array(option.repeat).fill((0, _functions.asArray)(funcArray)).reduce(function (dest, tasks) {
        tasks.forEach(function (fn, index) {
          return dest.push([index, fn]);
        });
        return dest;
      }, []);
      var sequanceLength = sequanceTaskEntries.length;
      var sequanceComplete = 0;
      var sequanceReseult = Array(sequanceTaskEntries.length);
      var sequanceOperator = (0, _operate.operate)({
        output: function () {
          var _output = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(_ref) {
            var entry;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    entry = _ref.entry;

                    if (!(option.interval > -1)) {
                      _context.next = 4;
                      break;
                    }

                    _context.next = 4;
                    return q.timeout(option.interval);

                  case 4:
                    return _context.abrupt("return", entry);

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function output(_x) {
            return _output.apply(this, arguments);
          };
        }(),
        limitOutput: 1
      }).operate({
        concurrent: option.concurrent,
        input: function () {
          var _input = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(_ref2) {
            var entry, index, fn;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    entry = _ref2.entry;
                    index = entry[0], fn = entry[1];
                    _context2.t0 = entry;
                    _context2.next = 5;
                    return fn();

                  case 5:
                    _context2.t1 = _context2.sent;

                    _context2.t0.push.call(_context2.t0, _context2.t1);

                    return _context2.abrupt("return", entry);

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function input(_x2) {
            return _input.apply(this, arguments);
          };
        }(),
        output: function output(_ref3) {
          var entry = _ref3.entry;
          var index = entry[0],
              fn = entry[1],
              result = entry[2];
          sequanceReseult[index] = result;
          sequanceComplete++;

          if (sequanceComplete === sequanceLength) {
            resolve(sequanceReseult);
          }
        }
      }).concat(sequanceTaskEntries);
    });
  };

  _exports.sequance = sequance;
});
//# sourceMappingURL=promise.js.map
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.object.keys", "regenerator-runtime/runtime", "core-js/modules/es6.array.fill", "core-js/modules/es6.string.repeat", "core-js/modules/es6.number.constructor", "core-js/modules/es6.array.from", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.iterator", "core-js/modules/es6.promise", "../functions", "./operate"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.object.keys"), require("regenerator-runtime/runtime"), require("core-js/modules/es6.array.fill"), require("core-js/modules/es6.string.repeat"), require("core-js/modules/es6.number.constructor"), require("core-js/modules/es6.array.from"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.promise"), require("../functions"), require("./operate"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Object, global.runtime, global.es6Array, global.es6String, global.es6Number, global.es6Array, global.webDom, global.es6Array, global.es6, global.functions, global.operate);
    global.promise = mod.exports;
  }
})(this, function (_exports, _es6Object, _runtime, _es6Array, _es6String, _es6Number, _es6Array2, _webDom, _es6Array3, _es, _functions, _operate) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.batch = _exports.until = _exports.promisify = _exports.defer = _exports.abort = _exports.valueOf = _exports.timeout = _exports.reject = _exports.resolve = _exports.all = _exports.promise = _exports.newPromise = void 0;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var PromiseClass = Promise;
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

  var timeout = function timeout(fn, time) {
    if (typeof fn === "number") {
      return newPromise(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, fn);
      });
    } else {
      return newPromise(function (resolve) {
        return setTimeout(function () {
          return resolve(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };

  _exports.timeout = timeout;
  PromiseFunction.timeout = timeout;

  var valueOf = function valueOf(maybeQ) {
    return newPromise(function (resolve, reject) {
      (0, _functions.likePromise)(maybeQ) ? maybeQ.then(resolve).catch(reject) : resolve(maybeQ);
    });
  };

  _exports.valueOf = valueOf;
  PromiseFunction.valueOf = valueOf;
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

  var abort = function abort(notifyConsole) {
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
  PromiseFunction.abort = abort;

  var defer = function defer() {
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
  PromiseFunction.defer = defer;

  var promisify = function promisify(asyncErrCallbackfn) {
    var argumentNames = (0, _functions.argumentNamesBy)(asyncErrCallbackfn).slice(1);

    var promisified = function promisified() {
      var _this = this;

      var args = Array.from(arguments);
      return new Promise(function (resolve, reject) {
        asyncErrCallbackfn.apply(_this, args.concat(function (err) {
          var _Array$from = Array.from(arguments),
              error = _Array$from[0],
              callbakArgs = _Array$from.slice(1);

          if (error) {
            reject(error);
          } else if (argumentNames.length && callbakArgs.length > 1) {
            resolve(argumentNames.reduce(function (dest, name, index) {
              dest[name] = callbakArgs[index];
              return dest;
            }, {}));
          } else {
            resolve(callbakArgs[0]);
          }
        }));
      });
    };

    return function () {
      return promisified.apply(this, Array.from(arguments));
    };
  };

  _exports.promisify = promisify;

  var until = function until(tasks, option) {
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
    var defer;
    var limit = typeof option.limit === "number" && option.limit > 0 ? parseInt(option.limit, 10) : 10000;
    var taskLength = tasks.length;
    var wheelTick = 0;
    var resetScope = 0;

    var nextWheelTick = function nextWheelTick(tick, value, tickScope) {
      var nowAction = tasks[(0, _functions.turn)(tick, taskLength, 1)];

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

    var thenStack = [function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    }];
    var catchStack = [function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return PromiseFunction.reject(e);
    }];

    var deferReset = function deferReset(resetTick) {
      defer && defer.stop(); //

      defer = PromiseFunction.defer();
      thenStack.forEach(function (fn) {
        return defer.promise.then(fn);
      });
      catchStack.forEach(function (fn) {
        return defer.promise.catch(fn);
      }); //

      defer.stop = function () {
        finished = null;
        resetScope += 1;
      };

      defer.start = function (resetTick) {
        if (finished === null) {
          finished = false;
          wheelTick = typeof resetTick === "number" ? resetTick : 0;
          nextWheelTick(wheelTick++, option.value, resetScope);
        }
      }; //


      defer.reset = deferReset; //

      finished = null;
      defer.start(resetTick);
    };

    deferReset(0);

    var wheelControls = _objectSpread({}, defer, {
      then: function then(fn) {
        defer.promise.then(fn);
        thenStack.push(fn);
        return wheelControls;
      },
      catch: function _catch(fn) {
        defer.promise.catch(fn);
        catchStack.push(fn);
        return wheelControls;
      }
    });

    return wheelControls;
  };

  _exports.until = until;

  var batch = function batch(funcArray, opts) {
    return newPromise(function (resolve, reject) {
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
                    return PromiseFunction.timeout(option.interval);

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

  _exports.batch = batch;
});
//# sourceMappingURL=promise.js.map
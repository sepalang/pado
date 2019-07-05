(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./promiseEngine", "./promise", "../../functions/cast", "../../functions/isLike", "../../functions/nice", "../../functions/hack", "../operate"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./promiseEngine"), require("./promise"), require("../../functions/cast"), require("../../functions/isLike"), require("../../functions/nice"), require("../../functions/hack"), require("../operate"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promiseEngine, global.promise, global.cast, global.isLike, global.nice, global.hack, global.operate);
    global.promiseFunctions = mod.exports;
  }
})(this, function (_exports, _promiseEngine, _promise, _cast, _isLike, _nice, _hack, _operate) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.abort = _exports.batch = _exports.until = _exports.promisify = void 0;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  var promisify = function promisify(asyncErrCallbackfn) {
    var argumentNames = (0, _hack.argumentNamesBy)(asyncErrCallbackfn).slice(1);

    var promisified = function promisified() {
      var _this = this;

      var args = Array.from(arguments);
      return new Promise(function (resolve, reject) {
        var applyParams = args.concat(function () {
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
        });
        asyncErrCallbackfn.apply(_this, applyParams);
      });
    };

    return function () {
      return promisified.apply(this, Array.from(arguments));
    };
  };

  _exports.promisify = promisify;

  var until = function until(tasks, option) {
    if (!(tasks instanceof Array)) {
      return _promise.promise.reject(new Error("tasks must be array"));
    }

    if (!tasks.length || !tasks.some(function (e) {
      return typeof e === "function";
    })) {
      return _promise.promise.reject(new Error("not found wheel executable"));
    }

    if (!tasks.some(function (e) {
      return typeof e !== "function" || typeof e !== "number";
    })) {
      return _promise.promise.reject(new Error("wheel task only function or number executable"));
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
      var nowAction = tasks[(0, _nice.turn)(tick, taskLength, 1)];

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
      if (finished === null) return abort();
      finished = true;
      return e;
    }];
    var catchStack = [function (e) {
      if (finished === null) return abort();
      finished = true;
      return _promise.promise.reject(e);
    }];

    var deferReset = function deferReset(resetTick) {
      defer && defer.stop(); //

      defer = _promise.promise.defer();
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

    var wheelControls = _extends({}, defer, {
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
    return (0, _promiseEngine.newPromise)(function (resolve) {
      var option = (0, _cast.asObject)(opts, "concurrent");

      if (option.concurrent === true) {
        option.concurrent = Number.POSITIVE_INFINITY;
      } else if (!(0, _isLike.isNumber)(option.concurrent) || option.concurrent < 1) {
        option.concurrent = 1;
      }

      if (!(0, _isLike.isNumber)(option.interval) || option.interval < -1) {
        option.interval = -1;
      }

      if (!(0, _isLike.isNumber)(option.repeat) || option.repeat < 1) {
        option.repeat = 1;
      } //set task with repeat


      var sequanceTaskEntries = Array(option.repeat).fill((0, _cast.asArray)(funcArray)).reduce(function (dest, tasks) {
        tasks.forEach(function (fn, index) {
          return dest.push([index, fn]);
        });
        return dest;
      }, []);
      var sequanceLength = sequanceTaskEntries.length;
      var sequanceComplete = 0;
      var sequanceReseult = Array(sequanceTaskEntries.length);
      (0, _operate.operate)({
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
                    return _promise.promise.timeout(option.interval);

                  case 4:
                    return _context.abrupt("return", entry);

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function output(_x) {
            return _output.apply(this, arguments);
          }

          return output;
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
                    // eslint-disable-next-line no-unused-vars
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
            }, _callee2);
          }));

          function input(_x2) {
            return _input.apply(this, arguments);
          }

          return input;
        }(),
        output: function output(_ref3) {
          var entry = _ref3.entry;
          // eslint-disable-next-line no-unused-vars
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
  }; // abort is deprecated


  _exports.batch = batch;
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

    return new _promiseEngine.PromiseClass(function (resolve, reject) {
      if (notifyConsole === true) {
        console.warn("abort promise");
      }

      reject(abortMessage);
    });
  };

  _exports.abort = abort;
});
//# sourceMappingURL=promiseFunctions.js.map
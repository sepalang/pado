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
    global.operate = mod.exports;
  }
})(this, function (_exports, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.operate = void 0;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  var operate = function () {
    var PARENT_OUTPUT_UPDATED = "ParentOutputUpdated";

    var operate = function operate(_ref) {
      var _this = this;

      var input = _ref.input,
          output = _ref.output,
          concurrent = _ref.concurrent,
          rescue = _ref.rescue,
          limitInput = _ref.limitInput,
          limitOutput = _ref.limitOutput;
      this.parent = undefined;
      this.children = [];
      this.inputs = [];
      this.outputs = [];
      this.limitInput = (0, _functions.isNumber)(limitInput) || limitInput > 0 ? limitInput : Number.POSITIVE_INFINITY;
      this.limitOutput = (0, _functions.isNumber)(limitOutput) || limitOutput > 0 ? limitOutput : Number.POSITIVE_INFINITY; //

      var current = 0;
      concurrent = (0, _functions.isNumber)(concurrent) || concurrent > 0 ? concurrent : 1;
      Object.defineProperty(this, "avaliablePullCount", {
        get: function get() {
          var limit = _this.limitInput - _this.inputs.length;
          if (limit < 0) limit = 0;
          return limit;
        }
      });
      Object.defineProperty(this, "avaliableOutputCount", {
        get: function get() {
          return _this.limitOutput + current + _this.outputs.length;
        }
      });
      var inputOutput = {
        input: input,
        output: output
      };

      var kickStart = function kickStart() {
        var avaliableQueLength = concurrent - current; // 작동가능한 큐

        if (avaliableQueLength < 1) {
          return;
        } // input의 길이로 확인하여 실행 가능한 큐


        if (avaliableQueLength > _this.inputs.length) {
          avaliableQueLength = _this.inputs.length;
        } // output의 제한을 확인하여 사용 가능한 큐


        if (avaliableQueLength > _this.avaliableOutputCount) {
          avaliableQueLength = _this.avaliableOutputCount;
        }

        if (avaliableQueLength < 1) {
          return;
        }

        Array(avaliableQueLength).fill(inputOutput).forEach(
        /*#__PURE__*/
        function () {
          var _ref3 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee2(_ref2) {
            var input, entry, outputHandle;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    input = _ref2.input;
                    entry = _this.inputs.shift();
                    current++;

                    outputHandle =
                    /*#__PURE__*/
                    function () {
                      var _ref4 = _asyncToGenerator(
                      /*#__PURE__*/
                      regeneratorRuntime.mark(function _callee(formInputDataum) {
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                /* TODO:lint
                                if(typeof output === "function"){
                                  const out = await output({ entry: formInputDataum })
                                }
                                */
                                _this.outputs.push(formInputDataum);

                                current--;

                                _this.children.forEach(function (child) {
                                  return child.emit(PARENT_OUTPUT_UPDATED);
                                });

                                kickStart();

                              case 4:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee);
                      }));

                      return function outputHandle(_x2) {
                        return _ref4.apply(this, arguments);
                      };
                    }();

                    if (!input) {
                      _context2.next = 23;
                      break;
                    }

                    _context2.prev = 5;
                    _context2.t0 = outputHandle;
                    _context2.next = 9;
                    return input({
                      entry: entry
                    });

                  case 9:
                    _context2.t1 = _context2.sent;
                    (0, _context2.t0)(_context2.t1);
                    _context2.next = 21;
                    break;

                  case 13:
                    _context2.prev = 13;
                    _context2.t2 = _context2["catch"](5);

                    if (!(typeof rescue === "function")) {
                      _context2.next = 19;
                      break;
                    }

                    rescue(_context2.t2);
                    _context2.next = 20;
                    break;

                  case 19:
                    throw _context2.t2;

                  case 20:
                    current--;

                  case 21:
                    _context2.next = 24;
                    break;

                  case 23:
                    outputHandle(entry);

                  case 24:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, null, [[5, 13]]);
          }));

          return function (_x) {
            return _ref3.apply(this, arguments);
          };
        }());
      };

      Object.defineProperty(this, "push", {
        value: function value(pushData) {
          _this.inputs.push(pushData);

          kickStart();
          return _this;
        }
      });
      Object.defineProperty(this, "concat", {
        value: function value(pushData) {
          (0, _functions.asArray)(pushData).forEach(function (d) {
            return _this.inputs.push(d);
          });
          kickStart();
          return _this;
        }
      });
      Object.defineProperty(this, "emit", {
        value: function value(eventName) {
          switch (eventName) {
            case PARENT_OUTPUT_UPDATED:
              if (_this.avaliablePullCount < 1) return;

              var pullData = _this.parent.pull(_this.avaliablePullCount);

              if (pullData.length < 1) return;
              pullData.forEach(function (datum) {
                return _this.inputs.push(datum);
              });
              kickStart();
              break;
          }
        }
      });
      Object.defineProperty(this, "pull", {
        value: function value(pullLength) {
          if (!((0, _functions.isNumber)(pullLength) || pullLength == Number.POSITIVE_INFINITY)) return [];

          var pullData = _this.outputs.splice(0, pullLength); //pullData.length && kickStart();


          return pullData;
        }
      });
      Object.defineProperty(this, "clone", {
        value: function value(deep) {
          if (deep === void 0) {
            deep = true;
          }

          var cloneOperate = operateFunction({
            input: input,
            output: output,
            concurrent: concurrent,
            rescue: rescue,
            limitInput: limitInput,
            limitOutput: limitOutput
          });
          deep === true && _this.children.forEach(function (child) {
            child.clone(true, cloneOperate);
          });
          return cloneOperate;
        }
      });
    };

    operate.prototype = {
      append: function append(child) {
        child.parent = this;
        this.children.push(child);
        return this;
      },
      remove: function remove(child) {
        var index = this.children.indexOf(child);
        if (index < 0) return this;
        child.parent = undefined;
        this.children.splice(index, 1);
      },
      operate: function operate(option) {
        return this.append(operateFunction(option));
      }
    };

    var operateFunction = function operateFunction(option) {
      return new operate(Object.assign({}, option));
    };

    return operateFunction;
  }();

  _exports.operate = operate;
});
//# sourceMappingURL=operate.js.map
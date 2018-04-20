(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.object.assign", "core-js/modules/es6.array.fill", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.object.assign"), require("core-js/modules/es6.array.fill"), require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Object, global.es6Array, global.functions);
    global.operate = mod.exports;
  }
})(this, function (_exports, _es6Object, _es6Array, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.operate = void 0;

  var immediate = function immediate(fn, timeout) {
    if (timeout === void 0) {
      timeout = 0;
    }

    var reserved;
    var allArgs = [];
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      allArgs.push(args);

      if (!reserved) {
        reserved = setTimeout(function () {
          fn(allArgs);
          allArgs = [];
          clearTimeout(reserved);
          reserved = undefined;
        }, 0);
      }
    };
  };

  var operate = function () {
    var PARENT_OUTPUT_UPDATED = "ParentOutputUpdated";
    var CHILDREN_INPUT_UPDATED = "ParentOutputUpdated";

    var operate = function operate(_ref) {
      var _this = this;

      var input = _ref.input,
          output = _ref.output,
          concurrent = _ref.concurrent,
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

        Array(avaliableQueLength).fill(inputOutput).forEach(function (_ref2) {
          var input = _ref2.input,
              output = _ref2.output;

          var entry = _this.inputs.shift();

          var outputHandle = function outputHandle(formInputDataum) {
            if (output) {
              output({
                entry: formInputDataum
              });
            }

            _this.outputs.push(formInputDataum);

            _this.children.forEach(function (child) {
              return child.emit(PARENT_OUTPUT_UPDATED);
            });

            kickStart();
          };

          if (input) {
            input({
              entry: entry,
              output: outputHandle
            });
          } else {
            outputHandle(entry);
          }
        });
      };

      Object.defineProperty(this, "push", {
        value: function value(pushData) {
          _this.inputs.push(pushData);

          kickStart();
          return _this;
        }
      });
      Object.defineProperty(this, "emit", {
        value: function value(eventName, payload) {
          switch (eventName) {
            case PARENT_OUTPUT_UPDATED:
              if (!_this.avaliablePullCount) return;

              var pullData = _this.parent.pull(_this.avaliablePullCount);

              if (!pullData.length) return;
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
          if (!(0, _functions.isNumber)(pullLength)) return [];

          var pullData = _this.outputs.splice(0, pullLength);

          pullData.length && kickStart();
          return pullData;
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
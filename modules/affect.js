(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../functions/isLike", "../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../functions/isLike"), require("../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.functions);
    global.affect = mod.exports;
  }
})(this, function (_exports, _isLike, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.affect = void 0;

  var ManualReactive = function ManualReactive(watch, effect, judgeOfEqual) {
    this.watch = watch;
    this.effect = effect;
    this.judgeOfEqual = typeof judgeOfEqual === "function" ? judgeOfEqual : function (a, b) {
      return a === b;
    };
    this.oldValue = undefined;
  };

  ManualReactive.prototype = {
    beginAffect: function beginAffect(watchValue) {
      this.effect(watchValue, (0, _functions.cloneDeep)(this.oldValue));
      this.oldValue = watchValue;
    },
    digest: function digest() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var watchResult = this.watch.apply(this, args);
      return this.judgeOfEqual(this.oldValue, watchResult) ? false : (this.beginAffect(watchResult), true);
    }
  };

  var affect = function affect(effect, judgeOfEqual) {
    var affectValue;
    var manualReactive = new ManualReactive(function () {
      return affectValue;
    }, effect, judgeOfEqual);
    return function (value) {
      affectValue = value;
      manualReactive.digest();
    };
  };

  _exports.affect = affect;
});
//# sourceMappingURL=affect.js.map
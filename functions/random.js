(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./matrix"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./matrix"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.matrix);
    global.random = mod.exports;
  }
})(this, function (_exports, _isLike, _matrix) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.randRange = _exports.tokenize = _exports.rand64 = void 0;

  var rand64 = function () {
    var rand64Token = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return function (length, codeAt, codeLength) {
      length = (0, _isLike.isAbsoluteNaN)(length) ? 1 : parseInt(length, 10);
      codeAt = (0, _isLike.isAbsoluteNaN)(codeAt) ? 0 : parseInt(codeAt, 10);
      codeLength = (0, _isLike.isAbsoluteNaN)(codeLength) ? 62 - codeAt : parseInt(codeLength, 10);
      var result = "";

      for (var i = 0, l = length; i < l; i++) {
        result = result + rand64Token.charAt(codeAt + parseInt(Math.random() * codeLength, 10));
      }

      return result;
    };
  }();

  _exports.rand64 = rand64;

  var tokenize = function tokenize(seed, digits) {
    return Math.floor(Math.abs(Math.sin(Number((seed + "").replace(/./g, function (s) {
      return s.charCodeAt(0);
    }))) * 16777215) % 16777215).toString(digits || 16);
  };

  _exports.tokenize = tokenize;

  var randRange = function randRange(rangeValue, nice) {
    var _rangeModel = (0, _matrix.rangeModel)(rangeValue),
        start = _rangeModel.start,
        end = _rangeModel.end;

    var result = start + Math.random() * (end - start);
    return nice === true ? Math.ceil(result) : result;
  };

  _exports.randRange = randRange;
});
//# sourceMappingURL=random.js.map
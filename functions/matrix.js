(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./cast", "./isLike", "./reducer", "./enumerator"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./cast"), require("./isLike"), require("./reducer"), require("./enumerator"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cast, global.isLike, global.reducer, global.enumerator);
    global.matrix = mod.exports;
  }
})(this, function (_exports, _cast, _isLike, _reducer, _enumerator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.matrixRange = _exports.domainRangeValue = _exports.range = _exports.rangeModel = void 0;

  var rangeModel = function rangeModel(value, step, sizeBase) {
    var start, end, reverse;

    if (typeof value === "number") {
      end = value;
      start = 0;
    } else if (typeof value === "object") {
      start = value[0];
      end = value[1];

      if (!step && typeof value[2] === "number") {
        step = value[2];
      }

      if (typeof sizeBase !== "boolean") {
        sizeBase = false;
      }
    }

    if (typeof start !== "number" || typeof end !== "number") {
      if (typeof start !== "number" && typeof end !== "number") return r;
      if (typeof start === "number") return r.push(start), r;
      if (typeof end === "number") return r.push(end), r;
    }

    if (start > end) {
      reverse = end;
      end = start;
      start = reverse;
      reverse = true;
    }

    end = parseFloat(end), end = (0, _isLike.isAbsoluteNaN)(end) ? 0 : end;
    start = parseFloat(start), start = (0, _isLike.isAbsoluteNaN)(start) ? 0 : start;
    step = parseFloat(step), step = (0, _isLike.isAbsoluteNaN)(step) || step == 0 ? 1 : step;
    return {
      start: start,
      end: end,
      step: step,
      reverse: reverse,
      sizeBase: sizeBase
    };
  };

  _exports.rangeModel = rangeModel;

  var range = function range(value, stepSize, sizeBaseRange) {
    var r = [];

    var _rangeModel = rangeModel(value, stepSize, sizeBaseRange),
        start = _rangeModel.start,
        end = _rangeModel.end,
        step = _rangeModel.step,
        reverse = _rangeModel.reverse,
        sizeBase = _rangeModel.sizeBase;

    if (step <= 0) {
      return console.warn("range::not support minus step"), r;
    }

    ;

    if (sizeBase == false) {
      for (var i = start, l = end; i <= l; i = i + step) {
        r.push(i);
      }
    } else {
      for (var i = start, l = end; i < l; i = i + step) {
        r.push(i);
      }
    }

    return reverse ? r.reverse() : r;
  };

  _exports.range = range;

  var domainRangeValue = function domainRangeValue(domain, range, vs, nice) {
    return forMap((0, _cast.cloneDeep)(vs), function (v, sel) {
      var $range = sel ? range[sel] : range;
      var $domain = sel ? domain[sel] : domain;

      if (!$range || !$domain) {
        return v;
      }

      var dSize = $domain[1] - $domain[0];
      var sSize = $range[1] - $range[0];
      var dRate = (v - $domain[0]) / dSize;
      var calc = $range[0] + sSize * dRate;
      return nice ? Math.floor(calc) : calc;
    });
  }; //matrixRange([1],[3]) // [[1], [2], [3]] 
  //matrixRange([1,1],[3,3]) // [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]


  _exports.domainRangeValue = domainRangeValue;

  var matrixRange = function matrixRange(start, end, step, sizeBase) {
    var scales = [];
    var maxLength = (0, _reducer.max)([start.length, end.length]);
    var selectLengthes = (0, _enumerator.times)(maxLength, function (scaleIndex) {
      var range = range([start[scaleIndex], end[scaleIndex]], step, sizeBase);
      scales.push(range);
      return range.length;
    });
    var result = (0, _enumerator.times)(reduce(selectLengthes, function (redu, value) {
      return redu * value;
    }, 1), function () {
      return new Array(maxLength);
    });
    var turnSize = 1;
    each(scales, function (scaleCase, scaleIndex) {
      var scaleCaseLength = scaleCase.length;
      (0, _enumerator.times)(result.length, function (time) {
        result[time][scaleIndex] = scaleCase[(0, _reducer.turn)(time, scaleCaseLength, turnSize)];
      });
      turnSize = turnSize * scaleCaseLength;
    });
    return result;
  };

  _exports.matrixRange = matrixRange;
});
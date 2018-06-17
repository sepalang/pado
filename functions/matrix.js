(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "./cast", "./isLike", "./reduce", "./nice", "./enumerable"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("./cast"), require("./isLike"), require("./reduce"), require("./nice"), require("./enumerable"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.cast, global.isLike, global.reduce, global.nice, global.enumerable);
    global.matrix = mod.exports;
  }
})(this, function (_exports, _webDom, _cast, _isLike, _reduce, _nice2, _enumerable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.matrixRange = _exports.domainRangeInterpolate = _exports.domainRangeValue = _exports.hashMap = _exports.range = _exports.rangeModel = void 0;

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
  }; //TODO : move to ?


  _exports.range = range;

  var hashMap = function hashMap(d, f) {
    if (typeof d === "object" && !(0, _isLike.isArray)(d)) {
      for (var k in d) {
        d[k] = f(d[k], k);
      }
    } else {
      return f(d, void 0);
    }

    return d;
  };

  _exports.hashMap = hashMap;

  var domainRangeValue = function domainRangeValue(domain, range, vs, nice, limit) {
    return hashMap((0, _cast.cloneDeep)(vs), function (v, sel) {
      var $range = sel ? range[sel] : range;
      var $domain = sel ? domain[sel] : domain;

      if (!$range || !$domain) {
        return v;
      }

      var dSize = $domain[1] - $domain[0];
      var sSize = $range[1] - $range[0];
      var dRate = (v - $domain[0]) / dSize;
      var calc = $range[0] + sSize * dRate;
      var result = nice ? Math.floor(calc) : calc;
      return limit ? $range[1] > $range[0] ? (0, _nice2.limitOf)(result, $range[1], $range[0]) : (0, _nice2.limitOf)(result, $range[0], $range[1]) : result;
    });
  };

  _exports.domainRangeValue = domainRangeValue;

  var domainRangeInterpolate = function domainRangeInterpolate(domain, range, nice, limit) {
    var _domain = domain;
    var _range = range;
    var _nice = nice;

    var interpolate = function interpolate(value) {
      return domainRangeValue(_domain, _range, value, _nice, limit);
    };

    interpolate.domain = function (domain) {
      _domain = domain;
      return interpolate;
    };

    interpolate.range = function (range) {
      _range = range;
      return interpolate;
    };

    interpolate.nice = function (nice) {
      _nice = nice;
      return interpolate;
    };

    return interpolate;
  }; //matrixRange([1],[3]) // [[1], [2], [3]] 
  //matrixRange([1,1],[3,3]) // [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]


  _exports.domainRangeInterpolate = domainRangeInterpolate;

  var matrixRange = function matrixRange(start, end, step, sizeBase) {
    var scales = [];
    var maxLength = (0, _reduce.top)([start.length, end.length]);
    var selectLengthes = (0, _enumerable.times)(maxLength, function (scaleIndex) {
      var range = range([start[scaleIndex], end[scaleIndex]], step, sizeBase);
      scales.push(range);
      return range.length;
    });
    var result = (0, _enumerable.times)(reduce(selectLengthes, function (redu, value) {
      return redu * value;
    }, 1), function () {
      return new Array(maxLength);
    });
    var turnSize = 1;
    (0, _cast.asArray)(scales).forEach(function (scaleCase, scaleIndex) {
      var scaleCaseLength = scaleCase.length;
      (0, _enumerable.times)(result.length, function (time) {
        result[time][scaleIndex] = scaleCase[(0, _nice2.turn)(time, scaleCaseLength, turnSize)];
      });
      turnSize = turnSize * scaleCaseLength;
    });
    return result;
  };

  _exports.matrixRange = matrixRange;
});
//# sourceMappingURL=matrix.js.map
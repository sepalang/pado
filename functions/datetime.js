(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.replace", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.replace"), require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.isLike, global.cast);
    global.datetime = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.timescaleExp = _exports.timestampExp = _exports.dateExp = void 0;

  var dateExp = function dateExp(dv, format, pad) {
    if ((0, _isLike.isArray)(dv)) dv = dv.join(' ');
    var dt = /(\d\d\d\d|)[^\d]?(\d\d|\d|).?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)/.exec(dv);
    dt[1] = dt[1] || new Date().getYear() + 1900 + '';
    dt[2] = dt[2] || new Date().getMonth() + 1;
    dt[3] = dt[3] || new Date().getDate();
    dt[4] = dt[4] || "00";
    dt[5] = dt[5] || "00";
    dt[6] = dt[6] || "00";
    var r = [dt[1], dt[2], dt[3], dt[4], dt[5], dt[6], dt[0]];
    r.year = dt[1], r.month = dt[2], r.date = dt[3], r.hour = dt[4], r.minute = dt[5], r.second = dt[6], r.init = dt[7];

    r.format = function (s) {
      return s.replace('YYYY', r.year).replace(/(MM|M)/, r.month).replace(/(DD|D)/, r.date).replace(/(hh|h)/, r.hour).replace(/(mm|m)/, r.minute).replace(/(ss|s)/, r.second).replace(/(A)/, (0, _cast.toNumber)(r.hour) > 12 ? 'PM' : 'AM');
    };

    if (typeof format === 'string') {
      return r.format(format);
    }

    return r;
  };

  _exports.dateExp = dateExp;

  var timestampExp = function timestampExp(exp) {
    if (arguments.length === 0) {
      return +new Date();
    }

    if (typeof exp === "string") {
      exp = dateExp(exp);
    }

    if (typeof exp === "number") {
      return exp;
    }

    if ((0, _isLike.isArray)(exp) && exp.length == 7) {
      exp = new Date(exp[0], exp[1], exp[2], exp[3], exp[4], exp[5]);
    }

    if (exp instanceof Date) {
      return +exp;
    }

    return 0;
  };

  _exports.timestampExp = timestampExp;

  var timescaleExp = function timescaleExp(exp) {
    var scale = 0;

    if (typeof exp === "number") {
      return exp;
    }

    if (typeof exp === "string") {
      // 
      exp = exp.replace(/\d+(Y|year)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 31536000000;
        });
        return "";
      });
      exp = exp.replace(/\d+(M|month)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 2678400000;
        });
        return "";
      });
      exp = exp.replace(/\d+(D|day)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 86400000;
        });
        return "";
      });
      exp = exp.replace(/\d+(h|hour)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 3600000;
        });
        return "";
      });
      exp = exp.replace(/\d+(ms|millisecond)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 1;
        });
        return "";
      });
      exp = exp.replace(/\d+(m|minute)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 60000;
        });
        return "";
      });
      exp = exp.replace(/\d+(s|second)/, function (t) {
        t.replace(/\d+/, function (d) {
          scale += d * 1000;
        });
        return "";
      });
    }

    return scale;
  };

  _exports.timescaleExp = timescaleExp;
});
//# sourceMappingURL=datetime.js.map
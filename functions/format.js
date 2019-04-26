(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.number.constructor"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.number.constructor"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Number);
    global.format = mod.exports;
  }
})(this, function (_exports, _es6Number) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.humanReadableBytesValue = _exports.humanReadableBytes = void 0;

  var humanReadableBytes = function humanReadableBytes(bytes) {
    var unit = 1024;
    if (bytes < unit) return bytes + " B";
    var exp = Math.floor(Math.log(bytes) / Math.log(unit));
    var pre = "KMGTPE".charAt(exp - 1);
    return (bytes / Math.pow(unit, exp)).toFixed(2) + ' ' + pre + 'B';
  };

  _exports.humanReadableBytes = humanReadableBytes;

  var humanReadableBytesValue = function humanReadableBytesValue(byteString) {
    if (typeof byteString === "number") {
      return byteString;
    }

    if (/^(|\.|[0-9]+\.)[0-9]+$/.test(byteString)) {
      return Math.ceil(Number(byteString));
    }

    var parse = /((|\.|[0-9]+\.)[0-9]+)[\s]*(|K|M|G|T|P|E)B/i.exec(byteString);
    if (!parse) return null;
    var number = parse[1];
    var unit = parse[3];
    if (number == 0) return 0;
    if (unit === "") return Number(number);
    var unitIndex = "KMGTPE".indexOf(unit.toUpperCase());

    if (unitIndex >= 0) {
      return Math.ceil(number * Math.pow(1024, unitIndex + 1));
    }

    return null;
  };

  _exports.humanReadableBytesValue = humanReadableBytesValue;
});
//# sourceMappingURL=format.js.map
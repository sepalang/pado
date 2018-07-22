(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "../functions/cast", "../functions/enumerable", "../functions/nice"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("../functions/cast"), require("../functions/enumerable"), require("../functions/nice"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.cast, global.enumerable, global.nice);
    global.matrix = mod.exports;
  }
})(this, function (_exports, _webDom, _cast, _enumerable, _nice) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.makeMatrixArray = _exports.PlainMatrix = void 0;

  var PlainMatrix = function () {
    var PlainMatrix = function PlainMatrix(data, column, row) {
      var _this = this;

      (0, _cast.asArray)(data).forEach(function (datum) {
        _this.push(datum);
      });
      Object.defineProperties(this, {
        column: {
          enumerable: false,
          value: column
        },
        row: {
          enumerable: false,
          value: row
        }
      });
    };

    PlainMatrix.prototype = {
      eachColumn: function eachColumn() {},
      eachRow: function eachRow() {},
      toMatrix: function toMatrix(eachResultHook) {
        var _this2 = this;

        var result = [];
        eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined;
        (0, _enumerable.times)(this.column * this.row, function (index) {
          var _turnTime = (0, _nice.turnTime)(index, _this2.column),
              colIndex = _turnTime[0],
              rowIndex = _turnTime[1];

          if (!result[rowIndex]) result.push([]);
          var dataResult = eachResultHook ? eachResultHook(data, index, colIndex, rowIndex) : data;
          result[rowIndex].push(dataResult);
        });
        return result;
      },
      multiply: function multiply() {}
    };
    return PlainMatrix;
  }();

  _exports.PlainMatrix = PlainMatrix;

  var makeMatrixArray = function makeMatrixArray(column, row, eachHook) {
    var matrixProto = (0, _enumerable.times)(column * row, function (index) {
      var _turnTime2 = (0, _nice.turnTime)(index, column),
          colIndex = _turnTime2[0],
          rowIndex = _turnTime2[1];

      return eachHook(index, colIndex, rowIndex);
    });
    return new PlainMatrix(matrixProto, column, row);
  };

  _exports.makeMatrixArray = makeMatrixArray;
});
//# sourceMappingURL=matrix.js.map
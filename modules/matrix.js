(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.object.assign", "core-js/modules/web.dom.iterable", "../functions/cast", "../functions/enumerable", "../functions/nice"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.object.assign"), require("core-js/modules/web.dom.iterable"), require("../functions/cast"), require("../functions/enumerable"), require("../functions/nice"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Object, global.webDom, global.cast, global.enumerable, global.nice);
    global.matrix = mod.exports;
  }
})(this, function (_exports, _es6Object, _webDom, _cast, _enumerable, _nice) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.makeMatrixArray = _exports.MatrixArray = void 0;

  var MatrixArray = function () {
    var MatrixArray = function MatrixArray(data, column, row) {
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

    MatrixArray.prototype = Object.assign([], {
      toString: function toString() {
        return "[object Array]";
      },
      toMatrix: function toMatrix(eachResultHook) {
        var _this2 = this;

        var result = [];
        eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined;
        (0, _enumerable.times)(this.column * this.row, function (index) {
          var _turnTime = (0, _nice.turnTime)(index, _this2.column),
              colIndex = _turnTime[0],
              rowIndex = _turnTime[1];

          var data = _this2[index];
          var dataResult = eachResultHook ? eachResultHook(data, index, colIndex, rowIndex) : data;
          if (!result[rowIndex]) result[rowIndex] = [];
          result[rowIndex].push(dataResult);
        });
        return result;
      },
      eachColumn: function eachColumn(eachFn) {
        var rows = this.toMatrix();
        var columns = (0, _enumerable.times)(this.column, function (colIndex) {
          var colData = [];
          rows.forEach(function (row) {
            return colData.push(row[colIndex]);
          });
          return colData;
        });
        return typeof eachFn === "function" ? columns.map(eachFn) : columns;
      },
      eachRow: function eachRow(eachFn) {
        var rows = this.toMatrix();
        return typeof eachFn === "function" ? rows.map(eachFn) : rows;
      },
      multiply: function multiply() {//TODO
      }
    });
    return MatrixArray;
  }();

  _exports.MatrixArray = MatrixArray;

  var makeMatrixArray = function makeMatrixArray(column, row, eachHook) {
    var matrixProto = (0, _enumerable.times)(column * row, function (index) {
      var _turnTime2 = (0, _nice.turnTime)(index, column),
          colIndex = _turnTime2[0],
          rowIndex = _turnTime2[1];

      return eachHook(index, colIndex, rowIndex) || [colIndex, rowIndex];
    });
    var matrixArray = new MatrixArray(matrixProto, column, row);
    return matrixArray;
  };

  _exports.makeMatrixArray = makeMatrixArray;
});
//# sourceMappingURL=matrix.js.map
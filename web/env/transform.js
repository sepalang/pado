(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.fill", "core-js/modules/web.dom.iterable", "core-js/modules/es6.object.assign", "core-js/modules/es6.regexp.split", "../../functions/isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.fill"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.object.assign"), require("core-js/modules/es6.regexp.split"), require("../../functions/isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.webDom, global.es6Object, global.es6Regexp, global.isLike);
    global.transform = mod.exports;
  }
})(this, function (_exports, _es6Array, _webDom, _es6Object, _es6Regexp, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.transformVariant = _exports.getElementTransform = _exports.getElementTransformMatrix = void 0;

  var getElementTransformMatrix = function getElementTransformMatrix(el) {
    var computedStyle = getComputedStyle(el, null);
    var computedMatrixParam = computedStyle.transform || computedStyle.webkitTransform || computedStyle.MozTransform || computedStyle.msTransform;
    var c = computedMatrixParam.split(/\s*[(),]\s*/).slice(1, -1);

    if (c.length === 6) {
      return [[+c[0], +c[2], 0, +c[4]], [+c[1], +c[3], 0, +c[5]], [0, 0, 1, 0], [0, 0, 0, 1]];
    } else if (c.length === 16) {
      return [[+c[0], +c[4], +c[8], +c[12]], [+c[1], +c[5], +c[9], +c[13]], [+c[2], +c[6], +c[10], +c[14]], [+c[3], +c[7], +c[11], +c[15]]];
    }

    return null;
  };
  /* https://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/ */


  _exports.getElementTransformMatrix = getElementTransformMatrix;

  var parseMatrix = function () {
    var DEFAULT_MATRIX = {
      m11: 1,
      m21: 0,
      m31: 0,
      m41: 0,
      m12: 0,
      m22: 1,
      m32: 0,
      m42: 0,
      m13: 0,
      m23: 0,
      m33: 1,
      m43: 0,
      m14: 0,
      m24: 0,
      m34: 0,
      m44: 1
    };
    return function (matrixParam) {
      var c = matrixParam.split(/\s*[(),]\s*/).slice(1, -1);
      var matrix;

      if (c.length === 6) {
        // 'matrix()' (3x2)
        matrix = {
          m11: +c[0],
          m21: +c[2],
          m31: 0,
          m41: +c[4],
          m12: +c[1],
          m22: +c[3],
          m32: 0,
          m42: +c[5],
          m13: 0,
          m23: 0,
          m33: 1,
          m43: 0,
          m14: 0,
          m24: 0,
          m34: 0,
          m44: 1
        };
      } else if (c.length === 16) {
        // matrix3d() (4x4)
        matrix = {
          m11: +c[0],
          m21: +c[4],
          m31: +c[8],
          m41: +c[12],
          m12: +c[1],
          m22: +c[5],
          m32: +c[9],
          m42: +c[13],
          m13: +c[2],
          m23: +c[6],
          m33: +c[10],
          m43: +c[14],
          m14: +c[3],
          m24: +c[7],
          m34: +c[11],
          m44: +c[15]
        };
      } else {
        // handle 'none' or invalid values.
        matrix = Object.assign({}, DEFAULT_MATRIX);
      }

      return matrix;
    };
  }();
  /* https://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/ */


  var getElementTransform = function getElementTransform(el) {
    var computedStyle = getComputedStyle(el, null);
    var val = computedStyle.transform || computedStyle.webkitTransform || computedStyle.MozTransform || computedStyle.msTransform;
    var matrix = parseMatrix(val);
    var rotateY = Math.asin(-matrix.m13);
    var rotateX = Math.atan2(matrix.m23, matrix.m33);
    var rotateZ = Math.atan2(matrix.m12, matrix.m11);
    return {
      rotate: {
        x: rotateX,
        y: rotateY,
        z: rotateZ
      },
      translate: {
        x: matrix.m41,
        y: matrix.m42,
        z: matrix.m43
      },
      matrix: matrix,
      transformStyle: val
    };
  };

  _exports.getElementTransform = getElementTransform;

  var transformVariant = function (likeString, isArray) {
    var TRANSFORM_UNDEFINED = "0";

    var parseTransformValue = function parseTransformValue(value, matched) {
      likeString(value) && matched(value);
    };

    var parseTransformMultivalue = function parseTransformMultivalue(value, matched) {
      isArray(value) && matched(value);
    };

    var valueProcess = function valueProcess(value, unit) {
      if (typeof value === "number") {
        return "" + value + unit;
      }

      if (typeof value === "string" && value.trim() !== "") {
        return value;
      }

      return undefined;
    };

    var singleValueHook = function singleValueHook(bag, unit, i) {
      return function (value) {
        var parseValue = valueProcess(value, unit);
        if (parseValue === undefined) return;
        bag[i] = parseValue;
      };
    };

    var multiValueHook = function multiValueHook(bag, unit) {
      return function (multiValue) {
        multiValue.forEach(function (value, i) {
          var parseValue = valueProcess(value, unit);
          if (parseValue === undefined) return;
          bag[i] = parseValue;
        });
      };
    };

    var oneNumberToTwoArray = function oneNumberToTwoArray(one) {
      return typeof one === "number" ? [one, one] : one;
    };

    return function (props) {
      if (typeof props !== "object") {
        return "";
      }

      var translateX = props.translateX,
          translateY = props.translateY,
          scaleX = props.scaleX,
          scaleY = props.scaleY,
          scaleZ = props.scaleZ,
          rotateX = props.rotateX,
          rotateY = props.rotateY,
          rotateZ = props.rotateZ;
      var translate = props.translate,
          translate3d = props.translate3d,
          scale = props.scale,
          scale3d = props.scale3d,
          rotate = props.rotate,
          rotate3d = props.rotate3d;
      translate = oneNumberToTwoArray(translate);
      translate3d = oneNumberToTwoArray(translate3d);
      scale = oneNumberToTwoArray(scale);
      scale3d = oneNumberToTwoArray(scale3d);

      if (typeof rotate === "number") {
        rotate = [undefined, undefined, rotate];
      }

      if (typeof rotate3d === "number") {
        rotate3d = [rotate3d];
      }

      var translateVars = Array(3).fill(TRANSFORM_UNDEFINED);
      var scaleVars = Array(3).fill(TRANSFORM_UNDEFINED);
      var rotateVars = Array(4).fill(TRANSFORM_UNDEFINED);
      var perspective = valueProcess(props.perspective, "px");
      var result = [];
      parseTransformMultivalue(translate, multiValueHook(translateVars, "px"));
      parseTransformMultivalue(translate3d, multiValueHook(translateVars, "px"));
      parseTransformMultivalue(scale, multiValueHook(scaleVars, "%"));
      parseTransformMultivalue(scale3d, multiValueHook(scaleVars, "%"));
      parseTransformMultivalue(rotate, multiValueHook(rotateVars, "deg"));
      parseTransformMultivalue(rotate3d, multiValueHook(rotateVars, "deg"));
      parseTransformValue(translateX, singleValueHook(translateVars, "px", 0));
      parseTransformValue(translateY, singleValueHook(translateVars, "px", 1));
      parseTransformValue(scaleX, singleValueHook(scaleVars, "%", 0));
      parseTransformValue(scaleY, singleValueHook(scaleVars, "%", 1));
      parseTransformValue(scaleZ, singleValueHook(scaleVars, "%", 2));
      parseTransformValue(rotateX, singleValueHook(rotateVars, "deg", 0));
      parseTransformValue(rotateY, singleValueHook(rotateVars, "deg", 1));
      parseTransformValue(rotateZ, singleValueHook(rotateVars, "deg", 2));
      perspective && result.push("perspective(" + perspective + ")");

      if (translateVars.some(function (v) {
        return v !== TRANSFORM_UNDEFINED;
      })) {
        translateVars[2] === TRANSFORM_UNDEFINED ? result.push("translate(" + translateVars[0] + "," + translateVars[1] + ")") : result.push("translate3d(" + translateVars[0] + "," + translateVars[1] + "," + translateVars[2] + ")");
      }

      if (scaleVars.some(function (v) {
        return v !== TRANSFORM_UNDEFINED;
      })) {
        scaleVars[2] === TRANSFORM_UNDEFINED ? result.push("scale(" + scaleVars[0] + "," + scaleVars[1] + ")") : result.push("scale3d(" + scaleVars[0] + "," + scaleVars[1] + "," + scaleVars[2] + ")");
      }

      if (rotateVars.some(function (v) {
        return v !== TRANSFORM_UNDEFINED;
      })) {
        if (rotateVars[0] === TRANSFORM_UNDEFINED && rotateVars[1] === TRANSFORM_UNDEFINED && rotateVars[2] !== TRANSFORM_UNDEFINED) {
          return result.push("rotate(" + rotateVars[2] + ")");
        }

        if (rotateVars[0] !== TRANSFORM_UNDEFINED) {
          result.push("rotate3d(1,0,0," + rotateVars[0] + ")");
        }

        if (rotateVars[1] !== TRANSFORM_UNDEFINED) {
          result.push("rotate3d(0,1,0," + rotateVars[1] + ")");
        }

        if (rotateVars[2] !== TRANSFORM_UNDEFINED) {
          result.push("rotate3d(0,0,1," + rotateVars[2] + ")");
        }
      }

      return result.join(" ");
    };
  }(_isLike.likeString, _isLike.isArray);

  _exports.transformVariant = transformVariant;
});
//# sourceMappingURL=transform.js.map
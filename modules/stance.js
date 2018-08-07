(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.sort", "core-js/modules/es6.regexp.split", "core-js/modules/es6.date.to-json", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable", "core-js/modules/es6.object.assign", "../functions/isLike", "../functions/cast", "../functions/matrix", "./matrix"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.sort"), require("core-js/modules/es6.regexp.split"), require("core-js/modules/es6.date.to-json"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.object.assign"), require("../functions/isLike"), require("../functions/cast"), require("../functions/matrix"), require("./matrix"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.es6Regexp, global.es6Date, global.es6Array, global.es6Object, global.webDom, global.es6Object, global.isLike, global.cast, global.matrix, global.matrix);
    global.stance = mod.exports;
  }
})(this, function (_exports, _es6Array, _es6Regexp, _es6Date, _es6Array2, _es6Object, _webDom, _es6Object2, _isLike, _cast, _matrix, _matrix2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rect = _exports.vertex = _exports.point = void 0;

  var likePoint = function likePoint(p) {
    return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y");
  };

  var Point = function Point(x, y, z, w, meta) {
    var _this = this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (z === void 0) {
      z = 0;
    }

    if (w === void 0) {
      w = 1;
    }

    // base point config
    var __ref = {
      x: x,
      y: y,
      z: z,
      w: w
    };

    var __meta; // compute matrix


    var __matrix = [];
    var __computed = {
      matrixVersion: 0,
      computedVersion: 0,
      memoizeRef: null,
      memoizeOutput: null
    };

    var compute = function compute(key) {
      var matrixVersion = __computed.matrixVersion,
          computedVersion = __computed.computedVersion; //why un used?
      //const { memoizeRef } = __computed;

      var needCompute = !__computed.memoizeRef || matrixVersion !== computedVersion || !(__computed.memoizeRef.x === __ref.x && __computed.memoizeRef.y === __ref.y && __computed.memoizeRef.z === __ref.z && __computed.memoizeRef.w === __ref.w);

      if (needCompute) {
        var newMemoizeRef = {
          x: __ref.x,
          y: __ref.y,
          z: __ref.z,
          w: __ref.w
        };

        var newComputedMatrix = __matrix.reduce(function (dest, matrix) {
          return (0, _matrix.multiplyMatrix)(matrix, dest);
        }, (0, _matrix.asMatrix)([newMemoizeRef.x, newMemoizeRef.y, newMemoizeRef.z, newMemoizeRef.w], 1)); //


        __computed.memoizeOutput = {
          x: newComputedMatrix[0][0],
          y: newComputedMatrix[0][1],
          z: newComputedMatrix[0][2],
          w: newComputedMatrix[0][3]
        };
        __computed.memoizeRef = newMemoizeRef;
        __computed.computedVersion = matrixVersion;
      } //else {
      //  console.log(`compute cache ${key}`);
      //}


      return key && __computed.memoizeOutput[key] || __computed.memoizeOutput;
    };

    Object.defineProperties(this, {
      x: {
        enumerable: true,
        get: function get() {
          return __matrix.length && compute('x') || __ref.x;
        },
        set: function set(v) {
          return __ref.x = v;
        }
      },
      y: {
        enumerable: true,
        get: function get() {
          return __matrix.length && compute('y') || __ref.y;
        },
        set: function set(v) {
          return __ref.y = v;
        }
      },
      z: {
        enumerable: true,
        get: function get() {
          return __matrix.length && compute('z') || __ref.z;
        },
        set: function set(v) {
          return __ref.z = v;
        }
      },
      w: {
        enumerable: true,
        get: function get() {
          return __matrix.length && compute('w') || __ref.w;
        },
        set: function set(v) {
          return __ref.w = v;
        }
      },
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          __meta = typeof it === "object" ? it : null;
          return __meta;
        }
      },
      rx: {
        enumerable: false,
        get: function get() {
          var rangeWidth = _this.meta && _this.meta.range && _this.meta.range.width || 0;
          return _this.x / rangeWidth;
        }
      },
      ry: {
        enumerable: false,
        get: function get() {
          var rangeHeight = _this.meta && _this.meta.range && _this.meta.range.height || 0;
          return _this.y / rangeHeight;
        }
      },
      addMatrix: {
        enumerable: false,
        value: function value(matrix) {
          if (!(0, _matrix.validMatrix)(matrix)) throw new Error("invalid addMatrix param");

          __matrix.push(matrix);

          __computed.matrixVersion += 1;
          return this;
        }
      }
    });
    this.meta = meta;
  };

  Point.prototype = {
    addMeta: function addMeta(obj) {
      if (typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj);
      return this;
    },
    clone: function clone() {
      return new Point(this.x, this.y, this.z, this.w, this.meta);
    },
    call: function call(fn) {
      if (typeof fn === "function") {
        return fn(this) || this;
      }

      return this;
    },
    toJSON: function toJSON(withMeta) {
      var json = {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      };
      if (withMeta === true && this.meta) json.meta = this.meta;
      return json;
    },
    pull: function pull(width, angle) {
      if (width === void 0) {
        width = 0;
      }

      if (angle === void 0) {
        angle = "horizontal";
      }

      var x = this.x,
          y = this.y,
          z = this.z,
          w = this.w;

      switch (angle) {
        case "h":
        case "horizontal":
          var xHalf = width <= 0 ? 0 : width / 2;
          return new Vertex([{
            x: x - xHalf,
            y: y,
            z: z,
            w: w
          }, {
            x: x + xHalf,
            y: y,
            z: z,
            w: w
          }]);

        default:
      }
    },
    vertexWith: function vertexWith(destPoint) {
      var points = (0, _cast.asArray)(destPoint);
      points.unshift(this);
      return new Vertex(points);
    },
    rectWith: function rectWith(_ref) {
      var x = _ref.x,
          y = _ref.y;

      var _ref2 = this.x > x ? [this.x, x] : [x, this.x],
          largeX = _ref2[0],
          smallX = _ref2[1];

      var _ref3 = this.y > y ? [this.y, y] : [y, this.y],
          largeY = _ref3[0],
          smallY = _ref3[1];

      return new Rect(smallX, smallY, largeX - smallX, largeY - smallY, 0, 0);
    }
  };

  var Vertex = function Vertex(pointArray, meta) {
    var _this2 = this;

    var __meta;

    Object.defineProperties(this, {
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          __meta = typeof it === "object" ? it : null;
          return __meta;
        }
      }
    });
    this.meta = meta;
    (0, _cast.asArray)(pointArray).forEach(function (point) {
      if (!likePoint(point)) return;
      var x = point.x,
          y = point.y,
          z = point.z,
          w = point.w;

      _this2.push(new Point(x, y, z, w, __meta));
    });
  };

  (function (classFunction, methods) {
    var prototype = [];
    classFunction.prototype = prototype;
    Object.keys(methods).forEach(function (key) {
      prototype[key] = methods[key];
    });
    Object.defineProperties(prototype, {
      start: {
        enumerable: false,
        get: function get() {
          return this[0];
        }
      },
      end: {
        enumerable: false,
        get: function get() {
          return !this.length ? void 0 : this[this.length - 1];
        }
      }
    });
  })(Vertex, {
    addMeta: function addMeta(obj) {
      if (typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj);
      return this;
    },
    toJSON: function toJSON(withMeta) {
      var result = [];
      this.forEach(function (p) {
        return result.push(p.toJSON(withMeta));
      });
      return result;
    },
    clone: function clone() {
      return new Vertex(this);
    },
    eq: function eq(index) {
      return this[index];
    },
    join: function join(fn) {
      var _this3 = this;

      var joins = [];
      this.forEach(function (refp, i) {
        joins.push(refp);
        if (!_this3[i + 1]) return;
        var newp = fn(refp, _this3[i + 1], i);
        if (!likePoint(newp)) return;
        var x = newp.x,
            y = newp.y,
            z = newp.z,
            w = newp.w,
            meta = newp.meta;
        joins.push(new Point(x, y, z, w, meta));
      });
      this.splice(0, this.length);
      joins.forEach(function (p) {
        return _this3.push(p);
      });
      return this;
    },
    point: function point(order) {
      switch (order) {
        case "e":
        case "end":
        case "d":
        case "down":
        case "r":
        case "right":
          var _this$end = this.end,
              px = _this$end.x,
              py = _this$end.y,
              pz = _this$end.z,
              pw = _this$end.w;
          return new Point(px, py, pz, pw, this.meta);

        case "c":
        case "m":
        case "center":
        case "middle":
          var _this$start = this.start,
              sx = _this$start.x,
              sy = _this$start.y,
              sz = _this$start.z,
              sw = _this$start.w;
          var _this$end2 = this.end,
              ex = _this$end2.x,
              ey = _this$end2.y,
              ez = _this$end2.z,
              ew = _this$end2.w;
          return new Point(sx / 2 + ex / 2, sy / 2 + ey / 2, sz / 2 + ez / 2, sw / 2 + ew / 2, this.meta);

        case "s":
        case "start":
        case "u":
        case "up":
        case "l":
        case "left":
        default:
          var _this$start2 = this.start,
              x = _this$start2.x,
              y = _this$start2.y,
              z = _this$start2.z,
              w = _this$start2.w;
          return new Point(x, y, z, w, this.meta);
      }
    },
    transform: function transform(_transform, rect) {
      var useRect = !!rect;

      if (useRect) {
        var left = rect.left,
            top = rect.top,
            width = rect.width,
            height = rect.height; //rotateOrigin

        var originX = left + width / 2;
        var originY = top + height / 2;
        this.forEach(function (point) {
          point.translate({
            x: -originX,
            y: -originY
          });
          point.transform(_transform);
          point.translate({
            x: originX,
            y: originY
          });
        });
      } else {
        this.forEach(function (point) {
          point.transform(_transform);
        });
      }

      return this;
    }
  });

  var Rect = function Rect(left, top, width, height, meta) {
    if (left === void 0) {
      left = 0;
    }

    if (top === void 0) {
      top = 0;
    }

    if (width === void 0) {
      width = 0;
    }

    if (height === void 0) {
      height = 0;
    }

    if (meta === void 0) {
      meta = null;
    }

    var __ref = {
      left: left,
      top: top,
      width: width,
      height: height
    };

    var __meta;

    Object.defineProperties(this, {
      width: {
        enumerable: true,
        get: function get() {
          return __ref.width;
        },
        set: function set(newValue) {
          var oldValue = __ref.width;
          __ref.width = newValue;
          __ref.right += newValue - oldValue;
          return newValue;
        }
      },
      height: {
        enumerable: true,
        get: function get() {
          return __ref.height;
        },
        set: function set(newValue) {
          var oldValue = __ref.height;
          __ref.height = newValue;
          __ref.bottom += newValue - oldValue;
          return newValue;
        }
      },
      left: {
        enumerable: true,
        get: function get() {
          return __ref.left;
        }
      },
      top: {
        enumerable: true,
        get: function get() {
          return __ref.top;
        }
      },
      right: {
        enumerable: true,
        get: function get() {
          return this.left + this.width;
        }
      },
      bottom: {
        enumerable: true,
        get: function get() {
          return this.top + this.height;
        }
      },
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          __meta = typeof it === "object" ? it : null;
          return __meta;
        }
      }
    });
    this.meta = meta;
  };

  var splitCountParser = function splitCountParser(split) {
    //splitCount [ horizental, vertical ]
    //1 = [ 1 ]
    //[1, 2] = [1, 2]
    var _asArray = (0, _cast.asArray)(split),
        columnOrder = _asArray[0],
        rowOrder = _asArray[1];

    return {
      column: (0, _isLike.isNumber)(columnOrder) && columnOrder > 0 ? parseInt(columnOrder, 10) : 1,
      row: (0, _isLike.isNumber)(rowOrder) && rowOrder > 0 ? parseInt(rowOrder, 10) : 1
    };
  };

  Rect.prototype = {
    addMeta: function addMeta(obj) {
      if (typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj);
      return this;
    },
    clone: function clone() {
      return new Rect(this.left, this.top, this.width, this.height, this.meta);
    },
    toJSON: function toJSON(withMeta) {
      var json = {
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
        right: this.right,
        bottom: this.bottom
      };
      if (withMeta === true && this.meta) json.meta = this.meta;
      return json;
    },
    findPoint: function findPoint(findWord) {
      var _ref4 = (0, _isLike.isArray)(findWord) ? findWord : findWord.trim().split(/\s+/),
          lineFind = _ref4[0],
          pointFind = _ref4[1];

      return this.vertex(lineFind).point(pointFind);
    },
    vertex: function vertex(order) {
      var inheritMeta = Object.assign({
        perspective: 0,
        perspectiveOrigin: {
          x: this.left + this.width / 2,
          y: this.top + this.top / 2,
          z: 0
        }
      }, this.meta);

      switch (order) {
        case "right":
        case "r":
          return new Vertex([{
            x: this.right,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        case "bottom":
        case "b":
          return new Vertex([{
            x: this.left,
            y: this.bottom,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        case "left":
        case "l":
          return new Vertex([{
            x: this.left,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.left,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        case "top":
        case "t":
          return new Vertex([{
            x: this.left,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.top,
            z: 0,
            w: 0
          }], inheritMeta);

        case "middle":
        case "m":
          var middleY = this.height / 2 + this.top;
          return new Vertex([{
            x: this.left,
            y: middleY,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: middleY,
            z: 0,
            w: 0
          }], inheritMeta);

        case "center":
        case "c":
          var centerX = this.width / 2 + this.x;
          return new Vertex([{
            x: centerX,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: centerX,
            y: this.bottom,
            z: 0,
            w: 0
          }], inheritMeta);

        default:
          return new Vertex([{
            x: this.left,
            y: this.top,
            z: 0,
            w: 0
          }, {
            x: this.left,
            y: this.bottom,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.bottom,
            z: 0,
            w: 0
          }, {
            x: this.right,
            y: this.top,
            z: 0,
            w: 0
          }], inheritMeta);
      }
    },
    piecesWithCount: function piecesWithCount(splitCount, eachResultHook) {
      var _splitCountParser = splitCountParser(splitCount),
          column = _splitCountParser.column,
          row = _splitCountParser.row;

      var width = this.width;
      var height = this.height;
      var pieceWidth = width / column;
      var pieceHeight = height / row;
      eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined;
      var pacResult = (0, _matrix2.makeMatrixArray)(column, row, function (index, colIndex, rowIndex) {
        var pacMeta = {
          column: colIndex,
          row: rowIndex,
          coords: [colIndex, rowIndex],
          range: {
            width: width,
            height: height
          }
        };
        var result = new Rect(colIndex * pieceWidth, rowIndex * pieceHeight, pieceWidth, pieceHeight, pacMeta);
        return eachResultHook ? eachResultHook(result, index, colIndex, rowIndex) : result;
      });
      return pacResult;
    },
    fit: function fit(rect) {
      if (typeof rect !== "object") {
        throw new Error("fit::argument[0] is not object");
      }

      var width = rect.width,
          height = rect.height;

      if (!(0, _isLike.isNumber)(width) || !(0, _isLike.isNumber)(height)) {
        throw new Error("fit::argument[0] is not { width:Number, height:Number }");
      }

      var WHRatio = [width / this.width, height / this.height];
      var transformRatio = WHRatio.sort()[0];
      this.width = this.width * transformRatio || 0;
      this.height = this.height * transformRatio || 0;
      return this;
    },
    //TODO : incompleted sticky(parent, position, offset);
    sticky: function sticky(_ref5, position) {
      var refX = _ref5.left,
          refY = _ref5.top,
          refWidth = _ref5.width,
          refHeight = _ref5.height;

      if (position === void 0) {
        position = "bottom left";
      }

      var left = this.left,
          top = this.top,
          width = this.width,
          height = this.height;

      switch (position) {
        case "bl":
        case "obl":
        case "bottom left":
        case "outer bottom left":
          return rect({
            left: refX,
            top: refY + refHeight,
            width: width,
            height: height
          });

        case "c":
        case "m":
        case "mc":
        case "center":
        case "middle":
        case "middle center":
          return rect({
            left: refX + refWidth / 2 - width / 2,
            top: refY + refHeight / 2 - height / 2,
            width: width,
            height: height
          });

        default:
          return rect({
            left: left,
            top: top,
            width: width,
            height: height
          });
      }
    }
  };

  var point = function point(x, y, z, w) {
    return typeof x === "object" ? new Point(x.x, x.y, x.z, x.w) : new Point(x, y, z, w);
  };

  _exports.point = point;

  var vertex = function vertex(start, end) {
    return new Vertex([{
      x: start.x,
      y: start.y,
      z: start.z,
      w: start.w
    }, {
      x: end.x,
      y: end.y,
      z: end.z,
      w: end.w
    }]);
  };

  _exports.vertex = vertex;

  var rect = function rect(left, top, width, height, x, y, valid) {
    return typeof left === "object" ? new Rect(left.left, left.top, left.width, left.height, left.x, left.y, left.valid) : new Rect(left, top, width, height, x, y, valid);
  };

  _exports.rect = rect;
});
//# sourceMappingURL=stance.js.map
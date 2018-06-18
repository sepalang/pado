(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.regexp.split", "core-js/modules/es6.date.to-json", "core-js/modules/es6.array.iterator", "core-js/modules/es6.object.keys", "core-js/modules/web.dom.iterable", "../functions/isLike", "../functions/cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.regexp.split"), require("core-js/modules/es6.date.to-json"), require("core-js/modules/es6.array.iterator"), require("core-js/modules/es6.object.keys"), require("core-js/modules/web.dom.iterable"), require("../functions/isLike"), require("../functions/cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Regexp, global.es6Date, global.es6Array, global.es6Object, global.webDom, global.isLike, global.cast);
    global.dimension = mod.exports;
  }
})(this, function (_exports, _es6Regexp, _es6Date, _es6Array, _es6Object, _webDom, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rect = _exports.vertex = _exports.point = _exports.pointArray = void 0;

  var likePoint = function likePoint(p) {
    return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y");
  };

  var Point = function Point(x, y, z, w) {
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
      w = 0;
    }

    var __ref = {
      x: x,
      y: y,
      z: z,
      w: w
    };
    Object.defineProperties(this, {
      x: {
        enumerable: true,
        get: function get() {
          return __ref.x;
        },
        set: function set(v) {
          return __ref.x = v;
        }
      },
      y: {
        enumerable: true,
        get: function get() {
          return __ref.y;
        },
        set: function set(v) {
          return __ref.y = v;
        }
      },
      z: {
        enumerable: true,
        get: function get() {
          return __ref.z;
        },
        set: function set(v) {
          return __ref.z = v;
        }
      },
      w: {
        enumerable: true,
        get: function get() {
          return __ref.w;
        },
        set: function set(v) {
          return __ref.w = v;
        }
      }
    });
  };

  Point.prototype = {
    clone: function clone() {
      return new Point(this.x, this.y, this.z, this.w);
    },
    toJSON: function toJSON() {
      return {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      };
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
      var pointArray = new Vertex(points.map(function (_ref) {
        var x = _ref.x,
            y = _ref.y,
            z = _ref.z,
            w = _ref.w;
        return new Point(x, y, z, w);
      }));
      return pointArray;
    },
    rectWith: function rectWith(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;

      var _ref3 = this.x > x ? [this.x, x] : [x, this.x],
          largeX = _ref3[0],
          smallX = _ref3[1];

      var _ref4 = this.y > y ? [this.y, y] : [y, this.y],
          largeY = _ref4[0],
          smallY = _ref4[1];

      return new Rect(smallX, smallY, largeX - smallX, largeY - smallY, 0, 0);
    },
    translate: function translate(_ref5) {
      var _ref5$x = _ref5.x,
          x = _ref5$x === void 0 ? 0 : _ref5$x,
          _ref5$y = _ref5.y,
          y = _ref5$y === void 0 ? 0 : _ref5$y,
          _ref5$z = _ref5.z,
          z = _ref5$z === void 0 ? 0 : _ref5$z;
      this.x = this.x + x;
      this.y = this.y + y;
      this.z = this.z + z;
      return this;
    },
    rotate: function rotate(_ref6) {
      var _ref6$x = _ref6.x,
          angleX = _ref6$x === void 0 ? 0 : _ref6$x,
          _ref6$y = _ref6.y,
          angleY = _ref6$y === void 0 ? 0 : _ref6$y,
          _ref6$z = _ref6.z,
          angleZ = _ref6$z === void 0 ? 0 : _ref6$z;
      var x1 = this.x,
          y1 = this.y,
          z1 = this.z,
          cr = Math.cos(angleX),
          cp = Math.cos(angleY),
          cy = Math.cos(angleZ),
          sr = Math.sin(angleX),
          sp = Math.sin(angleY),
          sy = Math.sin(angleZ),
          w = cr * cp * cy + -sr * sp * -sy,
          x = sr * cp * cy - -cr * sp * -sy,
          y = cr * sp * cy + sr * cp * sy,
          z = cr * cp * sy - -sr * sp * -cy,
          m0 = 1 - 2 * (y * y + z * z),
          m1 = 2 * (x * y + z * w),
          m2 = 2 * (x * z - y * w),
          m4 = 2 * (x * y - z * w),
          m5 = 1 - 2 * (x * x + z * z),
          m6 = 2 * (z * y + x * w),
          m8 = 2 * (x * z + y * w),
          m9 = 2 * (y * z - x * w),
          m10 = 1 - 2 * (x * x + y * y);
      this.x = x1 * m0 + y1 * m4 + z1 * m8;
      this.y = x1 * m1 + y1 * m5 + z1 * m9;
      this.z = x1 * m2 + y1 * m6 + z1 * m10;
      return this;
    },
    transform: function transform(_transform) {
      var rotate = _transform.rotate,
          translate = _transform.translate;
      this.rotate(rotate);
      this.translate(translate);
      return this;
    }
  };

  var Vertex = function Vertex(pointArray) {
    var _this = this;

    (0, _cast.asArray)(pointArray).forEach(function (point) {
      if (!likePoint(point)) return;
      var x = point.x,
          y = point.y,
          z = point.z,
          w = point.w;

      _this.push(new Point(x, y, z, w));
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
    toJSON: function toJSON() {
      var result = [];
      this.forEach(function (p) {
        return result.push(p.toJSON());
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
      var _this2 = this;

      var joins = [];
      this.forEach(function (refp, i) {
        joins.push(refp);
        if (!_this2[i + 1]) return;
        var newp = fn(refp, _this2[i + 1], i);
        if (!likePoint(newp)) return;
        var x = newp.x,
            y = newp.y,
            z = newp.z,
            w = newp.w;
        joins.push(new Point(x, y, z, w));
      });
      this.splice(0, this.length);
      joins.forEach(function (p) {
        return _this2.push(p);
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
          return new Point(px, py, pz, pw);

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
          return new Point(sx / 2 + ex / 2, sy / 2 + ey / 2, sz / 2 + ez / 2, sw / 2 + ew / 2);

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
          return new Point(x, y, z, w);
      }
    },
    transform: function transform(_transform2, rect) {
      var useRect = !!rect;

      if (useRect) {
        var left = rect.left,
            top = rect.top,
            width = rect.width,
            height = rect.height;
        ; //rotateOrigin

        var originX = left + width / 2;
        var originY = top + height / 2;
        this.forEach(function (point) {
          var left = rect.left,
              top = rect.top;
          point.translate({
            x: -originX,
            y: -originY
          });
          point.transform(_transform2);
          point.translate({
            x: originX,
            y: originY
          });
        });
      } else {
        this.forEach(function (point) {
          point.transform(_transform2);
        });
      }

      return this;
    }
  });

  var Rect = function Rect(left, top, width, height, x, y, valid) {
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

    if (valid === void 0) {
      valid = true;
    }

    var __ref = {
      left: left,
      top: top,
      width: width,
      height: height,
      x: x,
      y: y,
      valid: valid
    };
    Object.defineProperties(this, {
      x: {
        enumerable: true,
        get: function get() {
          return typeof __ref.x === "number" ? __ref.x : __ref.left;
        }
      },
      y: {
        enumerable: true,
        get: function get() {
          return typeof __ref.y === "number" ? __ref.y : __ref.top;
        }
      },
      width: {
        enumerable: true,
        get: function get() {
          return __ref.width;
        },
        set: function set(newValue) {
          var oldValue = __ref.width;
          var offsetValue = newValue - oldValue;
          __ref.width = newValue;
          __ref.right += offsetValue;
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
          var offsetValue = newValue - oldValue;
          __ref.height = newValue;
          __ref.bottom += offsetValue;
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
      valid: {
        get: function get() {
          return typeof __ref.valid === "boolean" ? __ref.valid : typeof __ref.left === "number" && typeof __ref.top === "number" && __ref.width >= 0 && __ref.height >= 0;
        }
      }
    });
  };

  Rect.prototype = {
    findPoint: function findPoint(findWord) {
      var _ref7 = (0, _isLike.isArray)(findWord) ? findWord : findWord.trim().split(/\s+/),
          lineFind = _ref7[0],
          pointFind = _ref7[1];

      return this.vertex(lineFind).point(pointFind);
    },
    vertex: function vertex(order) {
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
          }]);

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
          }]);

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
          }]);

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
          }]);

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
          }]);
      }
    },
    //TODO : incompleted sticky(parent, position, offset);
    sticky: function sticky(_ref8, position) {
      var refX = _ref8.left,
          refY = _ref8.top,
          refWidth = _ref8.width,
          refHeight = _ref8.height;

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
    },
    toJSON: function toJSON() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
        right: this.right,
        bottom: this.bottom,
        valid: this.valid
      };
    }
  };

  var pointArray = function pointArray(array) {
    return new PonintArray(array);
  };

  _exports.pointArray = pointArray;

  var point = function point(x, y, z, w) {
    return typeof x === "object" ? new Ponint(x.x, x.y, x.z, x.w) : new Ponint(x, y, z, w);
  };

  _exports.point = point;

  var vertex = function vertex(start, end) {
    new Vertex([{
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
//# sourceMappingURL=dimension.js.map
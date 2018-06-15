(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.fill"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.fill"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array);
    global.coordinate = mod.exports;
  }
})(this, function (_exports, _es6Array) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rect = _exports.line = _exports.point = void 0;

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
        }
      },
      y: {
        enumerable: true,
        get: function get() {
          return __ref.y;
        }
      },
      z: {
        enumerable: true,
        get: function get() {
          return __ref.z;
        }
      },
      w: {
        enumerable: true,
        get: function get() {
          return __ref.w;
        }
      }
    });
  };

  Point.prototype = {
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
          return new Line(x - xHalf, y, z, w, x + xHalf, y, z, w);

        default:
      }
    },
    toObject: function toObject() {
      return {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      };
    }
  };

  var Line = function Line(sx, sy, sz, sw, ex, ey, ez, ew) {
    var __ref = {
      sx: sx,
      sy: sy,
      sz: sz,
      sw: sw,
      ex: ex,
      ey: ey,
      ez: ez,
      ew: ew
    };
    Object.defineProperties(this, {
      start: {
        enumerable: true,
        get: function get() {
          return {
            x: __ref.sx,
            y: __ref.sy,
            w: __ref.sw,
            z: __ref.sz
          };
        }
      },
      end: {
        enumerable: true,
        get: function get() {
          return {
            x: __ref.ex,
            y: __ref.ey,
            w: __ref.ew,
            z: __ref.ez
          };
        }
      }
    });
  };

  Line.prototype = {
    points: function points(pointCount) {
      if (pointCount === void 0) {
        pointCount = 2;
      }

      var _this$start = this.start,
          sx = _this$start.x,
          sy = _this$start.y,
          sz = _this$start.z,
          sw = _this$start.w,
          _this$end = this.end,
          ex = _this$end.x,
          ey = _this$end.y,
          ez = _this$end.z,
          ew = _this$end.w;
      var divCount = pointCount - 1;
      var dx = ex - sx / divCount,
          dy = ey - sy / divCount,
          dz = ez - sz / divCount,
          dw = ew - sw / divCount;
      return Array(2).fill().map(function (v, i) {
        return new Point(sx + dx * i, sy + dy * i, sz + dz * i, sw + dw * i);
      });
    },
    point: function point(order) {
      switch (order) {
        case "e":
        case "end":
          var _this$end2 = this.end,
              px = _this$end2.x,
              py = _this$end2.y,
              pz = _this$end2.z,
              pw = _this$end2.w;
          return new Point(px, py, pz, pw);

        case "c":
        case "m":
        case "center":
        case "middle":
          var _this$start2 = this.start,
              sx = _this$start2.x,
              sy = _this$start2.y,
              sz = _this$start2.z,
              sw = _this$start2.w;
          var _this$end3 = this.end,
              ex = _this$end3.x,
              ey = _this$end3.y,
              ez = _this$end3.z,
              ew = _this$end3.w;
          return new Point(sx / 2 + ex / 2, sy / 2 + ey / 2, sz / 2 + ez / 2, sw / 2 + ew / 2);

        case "s":
        case "start":
        default:
          var _this$start3 = this.start,
              x = _this$start3.x,
              y = _this$start3.y,
              z = _this$start3.z,
              w = _this$start3.w;
          return new Point(x, y, z, w);
      }
    }
  };

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
        }
      },
      height: {
        enumerable: true,
        get: function get() {
          return __ref.height;
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
    point: function point() {
      return new Point(this.x, this.y);
    },
    line: function line(order) {
      switch (order) {
        case "top":
        case "t":
          return new Line(this.left, this.top, 0, 0, this.right, this.top, 0, 0);

        case "right":
        case "r":
          return new Line(this.right, this.top, 0, 0, this.right, this.bottom, 0, 0);

        case "bottom":
        case "b":
          return new Line(this.left, this.bottom, 0, 0, this.right, this.bottom, 0, 0);

        case "left":
        case "l":
          return new Line(this.left, this.top, 0, 0, this.left, this.bottom, 0, 0);
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

  var point = function point(x, y, z, w) {
    return typeof x === "object" ? new Ponint(x.x, x.y, x.z, x.w) : new Ponint(x, y, z, w);
  };

  _exports.point = point;

  var line = function line(start, end) {
    new Line(start.x, start.y, start.z, start.w, end.x, end.y, end.z, end.w);
  };

  _exports.line = line;

  var rect = function rect(left, top, width, height, x, y, valid) {
    return typeof left === "object" ? new Rect(left.left, left.top, left.width, left.height, left.x, left.y, left.valid) : new Rect(left, top, width, height, x, y, valid);
  };

  _exports.rect = rect;
});
//# sourceMappingURL=coordinate.js.map
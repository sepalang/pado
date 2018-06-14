(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.coordinate = mod.exports;
  }
})(this, function (_exports) {
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

    this._ref = {
      x: x,
      y: y,
      z: z,
      w: w
    };
  };

  Point.prototype = {
    toRect: function toRect(width, height) {
      if (width === void 0) {
        width = 0;
      }

      if (height === void 0) {
        height = 0;
      }

      return new Rect(this.x, this.y, width, height);
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
  Object.defineProperties(Point.prototype, {
    x: {
      get: function get() {
        return this._ref.x;
      }
    },
    y: {
      get: function get() {
        return this._ref.y;
      }
    },
    z: {
      get: function get() {
        return this._ref.z;
      }
    },
    w: {
      get: function get() {
        return this._ref.w;
      }
    }
  });

  var Line = function Line(sx, sy, sz, sw, ex, ey, ez, ew) {
    this._ref = {
      sx: sx,
      sy: sy,
      sz: sz,
      sw: sw,
      ex: ex,
      ey: ey,
      ez: ez,
      ew: ew
    };
  };

  Line.prototype = {
    point: function point(order) {
      switch (order) {
        case "e":
        case "end":
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
          return new Point(sx + ex / 2, sy + ey / 2, sz + ez / 2, sw + ew / 2);

        case "s":
        case "start":
        default:
          var _this$start2 = this.start,
              x = _this$start2.x,
              y = _this$start2.y,
              z = _this$start2.z,
              w = _this$start2.w;
          return new Point(x, y, z, w);
      }
    }
  };
  Object.defineProperties(Point.prototype, {
    start: {
      get: function get() {
        return {
          x: this._ref.sx,
          y: this._ref.sy,
          w: this._ref.sw,
          z: this._ref.sz
        };
      }
    },
    end: {
      get: function get() {
        return {
          x: this._ref.ex,
          y: this._ref.ey,
          w: this._ref.ew,
          z: this._ref.ez
        };
      }
    }
  });

  var Rect = function Rect(x, y, width, height) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (width === void 0) {
      width = 0;
    }

    if (height === void 0) {
      height = 0;
    }

    this.__ref = {
      x: x,
      y: y,
      width: width,
      height: height
    };
  };

  Rect.prototype = {
    point: function point() {
      return new Point(this.x, this.y);
    },
    line: function line(order) {
      switch (order) {
        case "top":
          return new Line(this.left, this.top, 0, 0, this.left, this.right, 0, 0);

        case "right":
          return new Line(this.right, this.top, 0, 0, this.right, this.bottom, 0, 0);

        case "bottom":
          return new Line(this.right, this.bottom, 0, 0, this.left, this.bottom, 0, 0);

        case "left":
          return new Line(this.left, this.top, 0, 0, this.left, this.bottom, 0, 0);
      }
    },
    object: function object() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
        right: this.right,
        bottom: this.bottom
      };
    }
  };
  Object.defineProperties(Rect.prototype, {
    x: {
      get: function get() {
        return this._ref.x;
      }
    },
    y: {
      get: function get() {
        return this._ref.y;
      }
    },
    width: {
      get: function get() {
        return this._ref.width;
      }
    },
    height: {
      get: function get() {
        return this._ref.height;
      }
    },
    left: {
      get: function get() {
        return this._ref.x;
      }
    },
    top: {
      get: function get() {
        return this._ref.y;
      }
    },
    right: {
      get: function get() {
        return this.x + this.width;
      }
    },
    bottom: {
      get: function get() {
        return this.y + this.height;
      }
    }
  });

  var point = function point(x, y, z, w) {
    return typeof x === "object" ? new Ponint(x.x, x.y, x.z, x.w) : new Ponint(x, y, z, w);
  };

  _exports.point = point;

  var line = function line(start, end) {
    new Line(start.x, start.y, start.z, start.w, end.x, end.y, end.z, end.w);
  };

  _exports.line = line;

  var rect = function rect(x, y, width, height) {
    return typeof x === "object" ? new Rect(x.x, x.y, x.width, x.height) : new Rect(x, y, width, height);
  };

  _exports.rect = rect;
});
//# sourceMappingURL=coordinate.js.map
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.pado = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var WINDOW_POPUP_DEFAULT_WIDTH = 1100;
  var WINDOW_POPUP_DEFAULT_HEIGHT = 900;
  var openWindow = function openWindow(href, windowParam) {
    var hasParam = typeof windowParam === "object";
    var windowName = hasParam && windowParam["name"] || "_blank";
    var useResize = (hasParam && windowParam["resize"] + "") !== "false";
    var destWindowWidth = hasParam && windowParam["width"] || WINDOW_POPUP_DEFAULT_WIDTH;
    var destWindowHeight = hasParam && windowParam["height"] || WINDOW_POPUP_DEFAULT_HEIGHT;
    var destWindowTop = hasParam && windowParam["top"] || windowParam["y"] || 0;
    var destWindowLeft = hasParam && windowParam["left"] || windowParam["x"] || 0;
    var availMaxWidth = screen.availWidth;
    var availMaxHeight = screen.availHeight; // IE bottom bar

    if (navigator.platform.indexOf("Win") === 0) {
      availMaxHeight -= 65;
    }

    if (destWindowWidth > availMaxWidth) destWindowWidth = availMaxWidth;
    if (destWindowHeight > availMaxHeight) destWindowHeight = availMaxHeight;
    var newWindow = window.open(href, windowName, "top=" + destWindowTop + ",left=" + destWindowLeft + ",width=" + destWindowWidth + ",height=" + destWindowHeight + (useResize ? ",resizable=1" : ",resizable=0") + ",scrollbars=yes,status=1");
    return newWindow;
  };
  var closeWindow = function closeWindow() {
    window.close();
  };
  var openTab = function openTab(href) {
    var newWindow = window.open(href, '_blank');
    newWindow.focus();
    return newWindow;
  };
  var historyBack = function historyBack(_ref) {
    var catchFallback = _ref.catchFallback;

    try {
      var history = window.history;
      var initialPage = history.length < 2;

      if (initialPage && catchFallback) {
        if (typeof catchFallback === "string") {
          location.href = catchFallback;
        }

        if (typeof catchFallback === "function") {
          return catchFallback();
        }
      } else {
        history.back();
      }
    } catch (e) {
      return null;
    }
  };

  var toDataString = function toDataString(tods) {
    switch (typeof tods) {
      case "string":
        return "\"" + tods + "\"";

      case "object":
        return JSON.stringify(tods);

      case "boolean":
      case "undefined":
      case "number":
      default:
        return "" + tods;
    }
  };

  var fromDataString = function fromDataString(v) {
    return eval("(" + v + ")");
  }; //로컬스토리지 데이터 저장


  var setLocalData = function setLocalData(k, v) {
    var localStorage = window.localStorage;

    if (typeof k === "object") {
      Object.keys(k).forEach(function (key) {
        localStorage.setItem(key, toDataString(k[key]));
      });
    } else {
      localStorage.setItem(k, toDataString(v));
    }

    return true;
  }; //로컬스토리지 데이터 불러오기

  var getLocalData = function getLocalData(k) {
    var localStorage = window.localStorage;
    if (!arguments.length) return localStorage;
    var stringData = localStorage.getItem(k);
    return stringData == null ? undefined : fromDataString(stringData);
  };

  var isAbsoluteNaN = function isAbsoluteNaN(it) {
    return it !== it && typeof it === "number";
  };
  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };
  var isNumber = function isNumber(it) {
    return typeof it === "number" && !isAbsoluteNaN(it);
  };
  var isArray = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };
  var isObject = function isObject(it) {
    return it !== null && typeof it === "object" ? true : false;
  };
  var likeString = function likeString(data) {
    if (typeof data === "string") return true;
    if (isNumber(data)) return true;
    return false;
  };
  var likeArray = function (nodeFn, webFn) {
    var definedNodeList;

    try {
      definedNodeList = 0 instanceof NodeList;
      definedNodeList = true;
    } catch (e) {
      definedNodeList = false;
    }

    return definedNodeList ? webFn : nodeFn;
  }( //nodeFn
  function (data) {
    return typeof data === "object" && data.hasOwnProperty("length") ? true : isArray(data);
  }, //webFn
  function (data) {
    return typeof data === "object" && data.hasOwnProperty("length") ? true : isArray(data) || data instanceof NodeList;
  }); //TODO : native isPlainObject

  var isNode = function isNode(a) {
    return isObject(a) && typeof a.nodeType === "number";
  };
  var isPlainObject = function isPlainObject(data) {
    return typeof data === "object" && data.constructor === Object;
  };

  var asArray = function asArray(data, defaultArray) {
    if (defaultArray === void 0) {
      defaultArray = undefined;
    }

    if (isArray(data)) {
      return data;
    }

    if (isNone(data)) {
      return isArray(defaultArray) ? defaultArray : isNone(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
  };

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
    clone: function clone$$1() {
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
      var points = asArray(destPoint);
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
    },
    translate: function translate(_ref4) {
      var _ref4$x = _ref4.x,
          x = _ref4$x === void 0 ? 0 : _ref4$x,
          _ref4$y = _ref4.y,
          y = _ref4$y === void 0 ? 0 : _ref4$y,
          _ref4$z = _ref4.z,
          z = _ref4$z === void 0 ? 0 : _ref4$z;
      this.x = this.x + x;
      this.y = this.y + y;
      this.z = this.z + z;
      return this;
    },
    rotate: function rotate(_ref5) {
      var _ref5$x = _ref5.x,
          angleX = _ref5$x === void 0 ? 0 : _ref5$x,
          _ref5$y = _ref5.y,
          angleY = _ref5$y === void 0 ? 0 : _ref5$y,
          _ref5$z = _ref5.z,
          angleZ = _ref5$z === void 0 ? 0 : _ref5$z;
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

    asArray(pointArray).forEach(function (point) {
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
    clone: function clone$$1() {
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
      var _ref6 = isArray(findWord) ? findWord : findWord.trim().split(/\s+/),
          lineFind = _ref6[0],
          pointFind = _ref6[1];

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
    sticky: function sticky(_ref7, position) {
      var refX = _ref7.left,
          refY = _ref7.top,
          refWidth = _ref7.width,
          refHeight = _ref7.height;

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
  var rect = function rect(left, top, width, height, x, y, valid) {
    return typeof left === "object" ? new Rect(left.left, left.top, left.width, left.height, left.x, left.y, left.valid) : new Rect(left, top, width, height, x, y, valid);
  };

  var getNode = function getNode(el) {
    var select = likeArray(el) ? el[0] : el;
    return isNode(select) ? select : undefined;
  };
  var isElement = function isElement(el) {
    return el instanceof Element;
  };
  var getElementOffsetRect = function getElementOffsetRect(el) {
    el = getNode(el);

    if (!isElement(el)) {
      return rect({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0,
        valid: false
      });
    }

    var offsetLeft = 0;
    var offsetTop = 0;
    var offsetWidth = el.offsetWidth;
    var offsetHeight = el.offsetHeight;

    do {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;

      if (!el.html && !el.body && /absoute|relative|fixed/.test(window.getComputedStyle(el).getPropertyValue("position"))) {
        el = null;
      }
    } while (el);

    return rect({
      x: offsetLeft,
      y: offsetTop,
      left: offsetLeft,
      top: offsetTop,
      width: offsetWidth,
      height: offsetHeight,
      valid: true
    });
  };

  var getBoundingRect = function getBoundingRect(el) {
    el = getNode(el);

    if (!isElement(el)) {
      return rect({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0,
        valid: false
      });
    }

    var doc = document;
    var win = window;
    var body = doc.body;
    var offsetX = win.pageXOffset !== undefined ? win.pageXOffset : (doc.documentElement || body.parentNode || body).scrollLeft;
    var offsetY = win.pageYOffset !== undefined ? win.pageYOffset : (doc.documentElement || body.parentNode || body).scrollTop;
    var boundingRect = el.getBoundingClientRect();

    if (el !== body) {
      var parent = el.parentNode;

      while (parent !== body) {
        offsetX += parent.scrollLeft;
        offsetY += parent.scrollTop;
        parent = parent.parentNode;
      }
    }

    return rect({
      x: boundingRect.left + offsetX,
      y: boundingRect.top + offsetY,
      left: boundingRect.left + offsetX,
      top: boundingRect.top + offsetY,
      width: boundingRect.width,
      height: boundingRect.height,
      right: boundingRect.right + offsetX,
      bottom: boundingRect.bottom + offsetY,
      valid: true
    });
  };

  var getElementBoundingRect = function getElementBoundingRect(el) {
    el = getNode(el);
    var win = window;
    var elRect = getBoundingRect(el).toJSON();

    if (elRect.valid === false) {
      return rect(elRect);
    }

    var current = el;
    var parent = el.parentNode;

    do {
      if (parent && !parent.html && !parent.body && /absoute|relative|fixed/.test(win.getComputedStyle(parent).getPropertyValue("position"))) {
        var _getBoundingRect = getBoundingRect(parent),
            top = _getBoundingRect.top,
            left = _getBoundingRect.left;

        elRect.top -= top;
        elRect.left -= left;
        elRect.right = elRect.left + elRect.width;
        elRect.bottom = elRect.top + elRect.height;
        current = parent = null;
      } else if (!parent) {
        current = null;
      } else {
        current = parent;
        parent = current.parentNode;
      }
    } while (!!parent);

    return rect(elRect);
  };
  /* https://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/ */

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
  var windowRect = function windowRect() {
    return rect({
      left: window.screenLeft || window.screenX,
      top: window.screenTop || window.screenY,
      width: window.outerWidth,
      height: window.outerHeight
    });
  };
  var screenRect = function screenRect() {
    return rect({
      left: 0,
      top: 0,
      width: screen.width,
      height: screen.height
    });
  };
  var transformVariant = function () {
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
  }();
  var svgPathWithVertex = function svgPathWithVertex(vertex$$1, close) {
    var dValue = "";
    vertex$$1.forEach(function (point$$1, index) {
      var prefix = index === 0 ? 'M' : 'L';
      dValue += "" + prefix + point$$1.x + " " + point$$1.y + " ";
    });

    if (!!dValue && close === true) {
      dValue += " Z";
    }

    return dValue;
  };

  var SVGBuilder = function SVGBuilder() {
    this.drawVariants = [];
  };

  SVGBuilder.prototype = {
    addPath: function addPath(points, attributes) {
      this.drawVariants.push({
        tag: "path",
        attributes: attributes,
        params: points
      });
      return this;
    },
    createElement: function createElement() {
      var svgTag = document.createElementNS('http://www.w3.org/2000/svg', "svg");
      var realMaxWidth = 0;
      var realMaxHeigth = 0;
      this.drawVariants.forEach(function (_ref) {
        var tag = _ref.tag,
            attributes = _ref.attributes,
            params = _ref.params;

        if (tag === "path") {
          var pathElement = document.createElementNS('http://www.w3.org/2000/svg', "path");

          if (typeof attributes !== "object") {
            attributes = {};
          }

          pathElement.setAttribute("fill", attributes['fill'] || "transparent");
          pathElement.setAttribute("stroke", attributes['stroke'] || "gray");
          pathElement.setAttribute("stroke-width", attributes['strokeWidth'] || attributes['stroke-width'] || "1");
          pathElement.setAttribute("stroke-linecap", "butt");
          pathElement.setAttribute("stroke-linejoin", "miter");
          var dValue = svgPathWithVertex(params);
          params.forEach(function (point$$1) {
            if (point$$1.x > realMaxWidth) realMaxWidth = point$$1.x;
            if (point$$1.y > realMaxHeigth) realMaxHeigth = point$$1.y;
          });
          pathElement.setAttribute("d", dValue);
          svgTag.appendChild(pathElement);
        }
      });
      svgTag.setAttribute("style", "overflow:visible;");
      svgTag.setAttribute("width", realMaxWidth);
      svgTag.setAttribute("height", realMaxHeigth);
      return svgTag;
    }
  };
  var makeSVG = function makeSVG() {
    return new SVGBuilder();
  };

  var rebase = function rebase(obj, ref) {
    var result = {};

    for (var key in obj) {
      if (key === ".*") {
        var refValue = obj[key];

        for (var i = 0, d = Object.keys(ref), l = d.length; i < l; i++) {
          var refKey = d[i];

          if (typeof refValue === "function") {
            result[refKey] = obj[key];
          } else {
            if (typeof refValue !== "object" && typeof refValue !== "object" || isNode(refValue)) {
              result[refKey] = refValue;
            } else {
              result[refKey] = Object.assign(result[refKey], refValue);
            }
          }
        }
      } else if (key.indexOf(",") > -1) {
        key.split(",").forEach(function (deepKey) {
          deepKey = deepKey.trim();

          if (typeof obj[key] === "function") {
            result[deepKey] = obj[key];
          } else {
            if (!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object" || isNode(obj[key])) {
              result[deepKey] = obj[key];
            } else {
              result[deepKey] = Object.assign(result[deepKey] || (isArray(obj[key]) ? [] : {}), obj[key], obj[deepKey]);
            }
          }
        });
      } else {
        if (typeof obj[key] === "function") {
          result[key] = obj[key];
        } else {
          if (typeof result[key] !== "object" && typeof obj[key] !== "object" || isNode(obj[key])) {
            result[key] = obj[key];
          } else {
            result[key] = Object.assign(result[key], obj[key]);
          }
        }
      }
    }

    return result;
  }; //TODO: Union hasValue

  /*
    usage
    const size = 20
    const stroke = 1

    const { x, y, radius, diameter } = drawCircleVars(size, stroke);
    
    const d = `M${x} ${y} 
    a ${radius} ${radius} 0 0 1 0 ${diameter}
    a ${radius} ${radius} 0 0 1 0 -${diameter}`

    <svg viewbox="0 0 {size} {size}">
      <path d="{d}" stroke-width="stroke"></path>
    </svg>
  */

  var readUrl = function readUrl(inputUrl) {
    var info;
    var url;

    try {
      url = inputUrl ? inputUrl : window.document.URL.toString();
      info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_\;\=]+|)(\?[\d\w\=\&\%\,\.\/\(\)-]+|)(\#[\d\w]*|)/.exec(url);
    } catch (e) {
      info = null;
    }

    if (info === null) {
      console.error("faild parse url", inputUrl);
      return {
        url: url || null,
        valid: false
      };
    }

    var protocol = info[1];
    var divider = info[2];
    var userinfo = info[3];
    var hostname = info[4];
    var port = info[5].substring(1);
    var path = info[6] + info[7];
    var query = info[8];
    var fragment = info[9];
    var filename = /(\/|)([\w\d\.\-\_]+|)$/.exec(info[6] + info[7])[2];
    var host = info[1] + info[2] + info[4] + info[5];

    var params = function () {
      var result = {};

      if (query) {
        query.substr(1).split("&").forEach(function (onePiece) {
          var entry = onePiece.split("=");
          result[decodeURI(entry[0])] = decodeURI(entry[1]);
        });
      }

      return result;
    }();

    return {
      url: url,
      protocol: protocol,
      divider: divider,
      userinfo: userinfo,
      hostname: hostname,
      port: port,
      path: path,
      query: query,
      fragment: fragment,
      filename: filename,
      host: host,
      params: params,
      valid: true
    };
  };
  var serialize = function serialize(obj, transform) {
    var params = [];
    var invalid = [];
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      var stringValue = "";

      if (typeof value === "undefined") {
        return;
      } else if (value === null) {
        stringValue = "";
      } else if (isArray(value)) {
        return value.each(function (val) {
          typeof transform === "function" ? params.push(transform(key) + "=" + transform(val)) : params.push(key + "=" + val);
        });
      } else if (typeof value === "object") {
        return invalid.push(key);
      } else {
        stringValue = value + "";
      }

      typeof transform === "function" ? params.push(transform(key) + "=" + transform(stringValue)) : params.push(key + "=" + stringValue);
    });

    if (invalid.length) {
      invalid = null;
    }

    return params.join("&");
  };

  var $ = require('jquery');

  var getCurrentTarget = function getCurrentTarget(originalEvent, fallbackElement) {
    var result = originalEvent.currentTarget || originalEvent.target;
    return result && result.documentElement ? fallbackElement || result.documentElement : document.documentElement;
  };

  var isElementEvent = $.isElementEvent = function (e) {
    return typeof e.stopPropagation === "function";
  };

  var getOriginalEvent = $.getOriginalEvent = function (e) {
    if (!isElementEvent(e)) return undefined;
  };

  var getElementPosition = $.getElementPosition = function (el) {
    var _$ = $(el),
        element = _$[0];

    if (!element) return null;
    var xPosition = 0;
    var yPosition = 0;

    while (element && !element.documentElement) {
      xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
      yPosition += element.offsetTop - element.scrollTop + element.clientTop;
      element = element.offsetParent;
    }

    return {
      x: xPosition,
      y: yPosition
    };
  };

  var getPointerPosition = $.getPointerPosition = function (e, root) {
    root = !root ? document.documentElement : root;
    var evt = getOriginalEvent(e);
    var pos = getElementPosition(root);
    if (!pos) return;
    pos.x = e.touches ? e.touches[0].pageX : e.clientX - pos.x;
    pos.y = e.touches ? e.touches[0].pageY : e.clientY - pos.y;
    return pos;
  };

  $.fn.extend({
    //파라메터 노드가 제이쿼리가 가진 노드 안에 있는지 확인
    containsIn: function containsIn(node) {
      var _$$eq = $(node).eq(0),
          target = _$$eq[0];

      if (target) for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] === target) return true;
        if (this.eq(i).find(target).length) return true;
      }
      return false;
    },
    //파라메터 노드가 제이쿼리가 가진 노드 밖에 있는지 확인
    containsOut: function containsOut(node) {
      return !this.containsIn(node);
    },

    /*
      //
      $(window).predict()
      $(window).predict({center:20});
      $(window).predict({center:event});
      
      //TODO
      $(window).predict(element)
      $(window).predict(element, {center:20});
    */
    predict: function predict(option, root) {
      var _this$eq = this.eq(0),
          element = _this$eq[0];

      if (!element) return;

      var _ref = element["innerWidth"] ? {
        offsetTop: 0,
        offsetLeft: 0,
        offsetWidth: window.innerWidth,
        offsetHeight: window.innerHeight
      } : element,
          offsetTop = _ref.offsetTop,
          offsetLeft = _ref.offsetLeft,
          offsetWidth = _ref.offsetWidth,
          offsetHeight = _ref.offsetHeight;

      var result = {
        top: offsetTop,
        left: offsetLeft,
        width: offsetWidth,
        height: offsetHeight,
        right: offsetLeft + offsetWidth,
        bottom: offsetTop + offsetHeight,
        center: offsetLeft + offsetWidth / 2,
        middle: offsetTop + offsetHeight / 2
      }; //if(isElementEvent(option)){
      //  const { x:left, y:top } = getPointerPosition(offset);
      //  option = { left, top };
      //}

      if (isPlainObject(option)) {
        var allProps = ["top", "left", "width", "height", "right", "bottom", "center", "middle"].filter(function (key) {
          return option.hasOwnProperty(key);
        }); //event option

        allProps.forEach(function (key) {
          var optionOfKey = option[key];
          if (!isElementEvent(optionOfKey)) return;
          var pointerPosition = getPointerPosition(optionOfKey, root || getCurrentTarget(optionOfKey, element) || element);
          if (!pointerPosition) return;

          if (/left|width|right|center/.test(key)) {
            option[key] = pointerPosition["x"];
          }

          if (/top|middle|bottom|height/.test(key)) {
            option[key] = pointerPosition["y"];
          }
        });
        allProps.forEach(function (key) {
          if (typeof option[key] !== "number") return;
          var valueOfKey = result[key];
          var equalize;

          switch (key) {
            case "top":
            case "middle":
              equalize = ["y", option[key] - valueOfKey];
              break;

            case "left":
            case "center":
              equalize = ["x", option[key] - valueOfKey];
              break;

            case "width":
              equalize = ["width", option[key] - valueOfKey];
              break;

            case "height":
              equalize = ["height", option[key] - valueOfKey];
              break;

            case "right":
              break;

            case "bottom":
              break;
          }

          switch (equalize && equalize[0]) {
            case "x":
              result["left"] += equalize[1];
              result["center"] += equalize[1];
              result["right"] += equalize[1];
              break;

            case "y":
              result["top"] += equalize[1];
              result["middle"] += equalize[1];
              result["bottom"] += equalize[1];
              break;

            case "width":
              result["width"] += equalize[1];
              result["right"] += equalize[1];
              result["center"] += result["right"] - result["left"] / 2;
              break;

            case "height":
              result["height"] += equalize[1];
              result["bottom"] += equalize[1];
              result["middle"] += result["bottom"] - result["top"] / 2;
              break;
          }
        });
      }

      return result;
    },
    flash: function flash() {}
  });

  var pointerParse = function pointerParse(_ref) {
    var clientX = _ref.clientX,
        clientY = _ref.clientY;
    return {
      x: clientX,
      y: clientY
    };
  };

  function DragHelper(element, option) {
    var $element = $(element).eq(0);
    var startFn;
    var moveFn;
    var endFn;
    var dragParams = null;
    var firstDrag = null;
    var lastDrag = null;

    var resetOptions = function resetOptions() {
      var getOptions = rebase(typeof option === "function" ? option({
        element: $element
      }) : option);
      startFn = getOptions["start"];
      moveFn = getOptions["move"];
      endFn = getOptions["end"];
    };

    var getCurrentPointerDrag = function getCurrentPointerDrag(originalEvent) {
      var pointerDrag = pointerParse(originalEvent); //현재 이동한 거리

      pointerDrag.moveX = pointerDrag.x - lastDrag.x;
      pointerDrag.moveY = pointerDrag.y - lastDrag.y; //처음으로부터 변경된 거리

      pointerDrag.offsetX = pointerDrag.x - firstDrag.x;
      pointerDrag.offsetY = pointerDrag.y - firstDrag.y; //처음으로 부터 변경되어 엘리먼트 오프셋 크기

      pointerDrag.leftValue = dragParams.offset.left + pointerDrag.offsetX;
      pointerDrag.topValue = dragParams.offset.top + pointerDrag.offsetY;
      pointerDrag.left = pointerDrag.leftValue + "px";
      pointerDrag.top = pointerDrag.topValue + pointerDrag.offsetY + "px";
      return pointerDrag;
    };

    var dragEnter = function dragEnter(_ref2) {
      var originalEvent = _ref2.originalEvent;
      //init
      resetOptions(); //

      var elementOffset = $element.predict();
      var pointerDrag = pointerParse(originalEvent);
      firstDrag = pointerDrag;
      lastDrag = pointerDrag;
      dragParams = {
        offset: elementOffset,
        pointer: undefined,
        event: originalEvent
      };
      dragParams.pointer = getCurrentPointerDrag(originalEvent);
      startFn && startFn(dragParams);
      $(document).on("mousemove", dragMove).on("mouseup", dragExit);
      $("body").attr("dragging", "");
    };

    var dragMove = function dragMove(_ref3) {
      var originalEvent = _ref3.originalEvent;
      var pointerDrag = pointerParse(originalEvent);

      if (!moveFn) {
        lastDrag = pointerDrag;
        return;
      } else {
        dragParams.pointer = getCurrentPointerDrag(originalEvent);
        dragParams.event = originalEvent;
        moveFn(dragParams);
        lastDrag = pointerDrag;
      }
    };

    var dragExit = function dragExit(_ref4) {
      var originalEvent = _ref4.originalEvent;
      dragParams.pointer = getCurrentPointerDrag(originalEvent);
      dragParams.event = originalEvent;
      endFn && endFn(dragParams);
      dragParams = undefined;
      $(document).off("mousemove", dragMove).off("mouseup", dragExit);
      $("body").removeAttr("dragging");
    };

    $element.on("mousedown", dragEnter);
    return $element;
  }

  function RepeatHelper(_ref) {
    var key = _ref.key,
        enterFn = _ref.enter,
        updateFn = _ref.update,
        exitFn = _ref.exit;
    // {key:string, vm:Component}
    var oldBag = []; // 모델의 키를 얻는 함수

    var getKey = typeof key === "function" ? key : function (datum) {
      return datum[key];
    }; // ng-repeat, v-for와 같은 리피터 구현체 (d3의 data().enter().exit() 컨샙이 비슷함)

    var repeater = function repeater(data) {
      var newData = asArray(data);
      var newBag = []; //새 데이터를 검사합니다.

      newData.forEach(function (datum, index) {
        //키를 추출합니다.
        var newDatumKey = getKey(datum) || index; //키 샘플입니다.

        var newMeta = {
          key: newDatumKey,
          datum: datum
        }; //매치되는 오래된 메타를 확인합니다.

        var matchOldMeta = oldBag.find(function (old) {
          return old.key === newDatumKey;
        }); //오래된 메타가 확인될 시

        if (matchOldMeta) {
          //exit를 하지 않고 살립니다.
          newMeta.vm = matchOldMeta.vm;
          matchOldMeta.$continue = true;
        }

        newBag.push(newMeta);
      }); //exit (require)

      oldBag.forEach(function (oldMeta) {
        if (!oldMeta.$continue) {
          exitFn(oldMeta);
        }
      }); //메타에 추가 정보 입력 (prevVm)

      newBag.forEach(function (newMeta, index) {
        var prevMeta = newBag[index - 1];

        if (prevMeta && prevMeta["vm"]) {
          newMeta["prevVm"] = prevMeta["vm"];
        }
      }); //enter (require)

      newBag.forEach(function (newMeta, index) {
        if (!newMeta.vm) {
          var result = enterFn(newMeta, index);

          if (!result) {
            throw new Error("enter는 반드시 vm을 리턴해야합니다.");
          } else {
            newMeta["vm"] = result;
          }
        }
      }); //update (option)

      updateFn && newBag.forEach(function (newMeta, index) {
        updateFn(newMeta, index);
      }); //history change

      oldBag = newBag;
    }; //컴포넌트에서 정렬된 데이터를 얻기위한 용도로 제작. Component에서 (개발 시간상) 한계로 이곳에서 수행


    repeater["vm"] = function () {
      return oldBag.map(function (d) {
        return d.vm;
      });
    };

    return repeater;
  }

  var dragHelper = DragHelper;
  var repeatHelper = RepeatHelper;



  var helpers = /*#__PURE__*/Object.freeze({
    openWindow: openWindow,
    closeWindow: closeWindow,
    openTab: openTab,
    historyBack: historyBack,
    setLocalData: setLocalData,
    getLocalData: getLocalData,
    getNode: getNode,
    isElement: isElement,
    getElementOffsetRect: getElementOffsetRect,
    getElementBoundingRect: getElementBoundingRect,
    getElementTransform: getElementTransform,
    windowRect: windowRect,
    screenRect: screenRect,
    transformVariant: transformVariant,
    svgPathWithVertex: svgPathWithVertex,
    makeSVG: makeSVG,
    readUrl: readUrl,
    serialize: serialize,
    dragHelper: dragHelper,
    repeatHelper: repeatHelper
  });

  var DEFAULT = _objectSpread({}, helpers);

  return DEFAULT;

})));
//# sourceMappingURL=pado.web.js.map

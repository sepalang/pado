(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.module = {})));
}(this, (function (exports) { 'use strict';

  var _ref = function () {
    //to children
    var reservedSessionStorage = {}; //my window

    var pulledWindowToken;
    var pulledWindowSession;
    var openerPresenceProps; //(부모) 윈도우의 정보를 저장

    var windowServiceReserveSession = function windowServiceReserveSession(name, data, listenHandshake) {
      if (listenHandshake === true) {
        window.windowServiceHandshake = function () {
          delete window.windowServiceHandshake;
          return name;
        };
      }

      reservedSessionStorage[name] = data;
      console.log('reservedSessionStorage', reservedSessionStorage);
      return reservedSessionStorage[name];
    }; //자식에게 세션을 당겨올수 있도록 지원


    var windowServicePullSession = function windowServicePullSession(name) {
      //console.log("windowServicePullSession",name);
      var data = reservedSessionStorage[name];
      delete reservedSessionStorage[name];
      return data;
    }; //


    var getOpenerPresenceProperties = function getOpenerPresenceProperties() {
      console.log("openerPresenceProps", openerPresenceProps);

      if (typeof openerPresenceProps === "function") {
        return openerPresenceProps();
      }

      return openerPresenceProps;
    };

    window.windowServiceReserveSession = windowServiceReserveSession;
    window.windowServicePullSession = windowServicePullSession;

    try {
      if (window.opener && window.opener.windowServiceHandshake) {
        pulledWindowToken = window.opener.windowServiceHandshake();
      }
    } catch (e) {
      console.warn("window.opener.windowServiceHandshake error");
    }

    if (pulledWindowToken && window.opener && window.opener.windowServicePullSession) {
      pulledWindowSession = window.opener.windowServicePullSession(pulledWindowToken);
      openerPresenceProps = pulledWindowSession; //임의로 언로드 됐을때 세션을 임시 저장

      var saveSessionFn = function saveSessionFn() {
        try {
          window.opener && window.opener.windowServiceReserveSession && window.opener.windowServiceReserveSession(pulledWindowSession.token, pulledWindowSession, true);
        } catch (e) {
          console.warn("Parent window not found.", e);
        }
      };

      window.addEventListener("beforeunload", saveSessionFn);
    }

    return {
      windowServiceReserveSession: windowServiceReserveSession,
      getOpenerPresenceProperties: getOpenerPresenceProperties
    };
  }(),
      windowServiceReserveSession = _ref.windowServiceReserveSession,
      getOpenerPresenceProperties = _ref.getOpenerPresenceProperties;

  var windowProps = getOpenerPresenceProperties;
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
    windowServiceReserveSession(windowName, windowProps, true);
    var newWindow = window.open(href, windowName, "top=" + destWindowTop + ",left=" + destWindowLeft + ",width=" + destWindowWidth + ",height=" + destWindowHeight + (useResize ? ",resizable=1" : ",resizable=0") + ",scrollbars=yes,status=1");
    return newWindow;
  };
  var closeWindow = function closeWindow() {
    window.close();
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
  var likePromise = function likePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
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

  var times = function times(length, fn) {
    var result = [];

    for (var i = 0, l = length; i < l; i++) {
      result.push(fn(i));
    }

    return result;
  };

  var turn = function turn(i, p, ts) {
    if (i < 0) {
      var abs = Math.abs(i / ts);
      i = p - (abs > p ? abs % p : abs);
    }

    ts = ts || 1;
    i = Math.floor(i / ts);
    return p > i ? i : i % p;
  };

  var validMatrix = function validMatrix(arr) {
    // Matrix must be array
    if (!likeArray(arr)) {
      return false;
    } // Empty is valid


    if (arr.length === 0) {
      return true;
    }

    var colLength = arr[0].length; //find some error ( return true => false)

    return Array.from(arr).some(function (v, i) {
      if (likeArray(v)) {
        //length check
        if (v.length !== arr.length) return true; //type check

        return v.some(function (likeError) {
          return !(likeError == undefined || isNumber(likeError));
        });
      }

      return true;
    }) ? false : true;
  }; // real matrix model

  var asMatrix = function asMatrix(arr, columnSize) {
    var result = [];

    if (typeof columnSize === "number" && columnSize > 0) {
      var rowCount = Math.ceil(arr.length / columnSize);
      times(rowCount, function (i) {
        var column = [];
        times(columnSize, function (ci) {
          column.push(arr[i * columnSize + ci]);
        });
        result.push(column);
      });
    } else {
      return [arr];
    }

    return result;
  };
  var multiplyMatrix = function multiplyMatrix(aMatrix, bMatrix) {
    if (!validMatrix(aMatrix) && validMatrix(bMatrix)) {
      return null;
    }

    if (aMatrix[0].length !== bMatrix.length) {
      return null;
    }

    var result = [];
    times(bMatrix.length, function (rRowIndex) {
      var columnLength = bMatrix[rRowIndex].length;
      var columnResult = [];
      times(columnLength, function (rColumnIndex) {
        //var calcLog = [];
        var multiplied = aMatrix[rRowIndex].reduce(function (dist, num, index) {
          //calcLog.push(`${num} * ${bMatrix[index][rColumnIndex]}`)
          return num * bMatrix[index][rColumnIndex] + dist;
        }, 0); //console.log("calcLog",calcLog.join(" + "))

        columnResult.push(multiplied);
      });
      result.push(columnResult);
    });
    return result;
  };

  var likePoint = function likePoint(p) {
    return typeof p === "object" && p.hasOwnProperty("x") && p.hasOwnProperty("y");
  };

  var Point = function Point(x, y, z, w, meta) {
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
          computedVersion = __computed.computedVersion;
      var needCompute = !__computed.memoizeRef || matrixVersion !== computedVersion || !(__computed.memoizeRef.x === __ref.x && __computed.memoizeRef.y === __ref.y && __computed.memoizeRef.z === __ref.z && __computed.memoizeRef.w === __ref.w);

      if (needCompute) {
        var newMemoizeRef = {
          x: __ref.x,
          y: __ref.y,
          z: __ref.z,
          w: __ref.w
        };

        var newComputedMatrix = __matrix.reduce(function (dest, matrix) {
          return multiplyMatrix(matrix, dest);
        }, asMatrix([newMemoizeRef.x, newMemoizeRef.y, newMemoizeRef.z, newMemoizeRef.w], 1)); //


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
          this.__meta = typeof it === "object" ? it : null;
          return this.__meta;
        }
      },
      addMatrix: {
        enumerable: false,
        value: function value(matrix) {
          if (!validMatrix(matrix)) throw new Error("invalid addMatrix param");

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
    clone: function clone$$1() {
      return new Point(this.x, this.y, this.z, this.w);
    },
    toJSON: function toJSON(withMeta) {
      var json = {
        x: this.x,
        y: this.y,
        z: this.z,
        w: this.w
      };
      if (withMeta === true && this.meta) json.meta = meta;
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
    }
  };

  var Vertex = function Vertex(pointArray, meta) {
    var _this = this;

    var __meta;

    Object.defineProperties(this, {
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          this.__meta = typeof it === "object" ? it : null;
          return this.__meta;
        }
      }
    });
    this.meta = meta;
    asArray(pointArray).forEach(function (point) {
      if (!likePoint(point)) return;
      var x = point.x,
          y = point.y,
          z = point.z,
          w = point.w;

      _this.push(new Point(x, y, z, w, __meta));
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
            w = newp.w,
            meta = newp.meta;
        joins.push(new Point(x, y, z, w, meta));
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
          return new Point(x, y, z, w, this.meta);
      }
    },
    transform: function transform(_transform, rect) {
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
      meta: {
        enumerable: false,
        get: function get() {
          return __meta;
        },
        set: function set(it) {
          this.__meta = typeof it === "object" ? it : null;
          return this.__meta;
        }
      }
    });
    this.meta = meta;
  };

  Rect.prototype = {
    addMeta: function addMeta(obj) {
      if (typeof obj === "object") this.meta = Object.assign(this.meta && this.meta || {}, obj);
      return this;
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
      if (withMeta === true && this.meta) json.meta = meta;
      return json;
    },
    findPoint: function findPoint(findWord) {
      var _ref4 = isArray(findWord) ? findWord : findWord.trim().split(/\s+/),
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
  var windowRect = function windowRect() {
    return rect({
      left: window.screenLeft || window.screenX,
      top: window.screenTop || window.screenY,
      width: window.outerWidth,
      height: window.outerHeight
    });
  };
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

  var PromiseClass = Promise;
  var resolveFn = PromiseClass.resolve;
  var rejectFn = PromiseClass.reject;
  var newPromise = function newPromise(fn) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      likePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  };
  var promise = function promise(fn) {
    return newPromise(fn);
  };
  var PromiseFunction = promise;
  var all$1 = Promise.all;
  PromiseFunction.all = all$1;
  var resolve = resolveFn;
  PromiseFunction.resolve = resolve;
  var reject = rejectFn;
  PromiseFunction.reject = reject;
  var timeout = function timeout(fn, time) {
    if (typeof fn === "number") {
      return newPromise(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, fn);
      });
    } else {
      return newPromise(function (resolve) {
        return setTimeout(function () {
          return resolve(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };
  PromiseFunction.timeout = timeout;
  var valueOf = function valueOf(maybeQ) {
    return newPromise(function (resolve, reject) {
      likePromise(maybeQ) ? maybeQ.then(resolve).catch(reject) : resolve(maybeQ);
    });
  };
  PromiseFunction.valueOf = valueOf;
  var abortMessage = new function () {
    Object.defineProperty(this, "message", {
      get: function get$$1() {
        return ":abort";
      }
    });
    Object.defineProperty(this, "abort", {
      get: function get$$1() {
        return true;
      }
    });
  }();
  var abort = function abort(notifyConsole) {
    if (notifyConsole === void 0) {
      notifyConsole = undefined;
    }

    return new PromiseClass(function (resolve, reject) {
      if (notifyConsole === true) {
        console.warn("abort promise");
      }

      reject(abortMessage);
    });
  };
  PromiseFunction.abort = abort;
  var defer = function defer() {
    var resolve, reject;
    var promise = new PromiseClass(function () {
      resolve = arguments[0];
      reject = arguments[1];
    });
    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    };
  };
  PromiseFunction.defer = defer;
  var until = function until(tasks, option) {
    if (!(tasks instanceof Array)) {
      return PromiseFunction.reject(new Error("tasks must be array"));
    }

    if (!tasks.length || !tasks.some(function (e) {
      return typeof e === "function";
    })) {
      return PromiseFunction.reject(new Error("not found wheel executable"));
    }

    if (!tasks.some(function (e) {
      return typeof e !== "function" || typeof e !== "number";
    })) {
      return PromiseFunction.reject(new Error("wheel task only function or number executable"));
    }

    if (typeof option !== "object") {
      option = {};
    }

    var finished = false;
    var defer;
    var limit = typeof option.limit === "number" && option.limit > 0 ? parseInt(option.limit, 10) : 10000;
    var taskLength = tasks.length;
    var wheelTick = 0;
    var resetScope = 0;

    var nextWheelTick = function nextWheelTick(tick, value, tickScope) {
      var nowAction = tasks[turn(tick, taskLength, 1)];

      var isActiveFn = function isActiveFn() {
        return tickScope === resetScope;
      };

      var nextTickFn = function nextTickFn(passValue) {
        // if reset called
        if (!isActiveFn()) return; // if over tick

        if (wheelTick > limit) {
          return defer.reject(new Error("limit"));
        }

        if (finished === false) {
          nextWheelTick(wheelTick++, passValue, tickScope);
        }
      };

      if (typeof nowAction === "function") {
        nowAction({
          value: value,
          next: nextTickFn,
          isActive: isActiveFn,
          resolve: defer.resolve,
          reject: defer.reject
        }, Math.floor(tick / tasks.length), tick);
      } else if (typeof nowAction === "number") {
        setTimeout(function () {
          nextTickFn(value);
        }, nowAction);
      }
    };

    var thenStack = [function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    }];
    var catchStack = [function (e) {
      if (finished === null) return PromiseFunction.abort();
      finished = true;
      return PromiseFunction.reject(e);
    }];

    var deferReset = function deferReset(resetTick) {
      defer && defer.stop(); //

      defer = PromiseFunction.defer();
      thenStack.forEach(function (fn) {
        return defer.promise.then(fn);
      });
      catchStack.forEach(function (fn) {
        return defer.promise.catch(fn);
      }); //

      defer.stop = function (resetTick) {
        finished = null;
        resetScope += 1;
      };

      defer.start = function (resetTick) {
        if (finished === null) {
          finished = false;
          wheelTick = typeof resetTick === "number" ? resetTick : 0;
          nextWheelTick(wheelTick++, option.value, resetScope);
        }
      }; //


      defer.reset = deferReset; //

      finished = null;
      defer.start(resetTick);
    };

    deferReset(0);

    var wheelControls = _objectSpread({}, defer, {
      then: function then(fn) {
        defer.promise.then(fn);
        thenStack.push(fn);
        return wheelControls;
      },
      catch: function _catch(fn) {
        defer.promise.catch(fn);
        catchStack.push(fn);
        return wheelControls;
      }
    });

    return wheelControls;
  };

  //  point,
  //  vertex,
  //  rect
  //} from '../../../.src/modules/dimension';

  exports.readUrl = readUrl;
  exports.windowRect = windowRect;
  exports.windowProps = windowProps;
  exports.openWindow = openWindow;
  exports.closeWindow = closeWindow;
  exports.getElementBoundingRect = getElementBoundingRect;
  exports.svgPathWithVertex = svgPathWithVertex;
  exports.until = until;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

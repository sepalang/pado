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
    var availMaxWidth = screen.availWidth;
    var availMaxHeight = screen.availHeight; // IE bottom bar

    if (navigator.platform.indexOf("Win") === 0) {
      availMaxHeight -= 65;
    }

    if (destWindowWidth > availMaxWidth) destWindowWidth = availMaxWidth;
    if (destWindowHeight > availMaxHeight) destWindowHeight = availMaxHeight;
    var newWindow = window.open(href, windowName, "width=" + destWindowWidth + ",height=" + destWindowHeight + (useResize ? ",resizable=1" : "") + ",scrollbars=yes,status=1");
    return newWindow;
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

  var getBoundingRect = function getBoundingRect(el) {
    var doc = document;
    var win = window;
    var body = doc.body;
    var offsetX = win.pageXOffset !== undefined ? win.pageXOffset : (doc.documentElement || body.parentNode || body).scrollLeft;
    var offsetY = win.pageYOffset !== undefined ? win.pageYOffset : (doc.documentElement || body.parentNode || body).scrollTop;
    var rect = el.getBoundingClientRect();

    if (el !== body) {
      var parent = el.parentNode;

      while (parent !== body) {
        offsetX += parent.scrollLeft;
        offsetY += parent.scrollTop;
        parent = parent.parentNode;
      }
    }

    return {
      x: rect.left + offsetX,
      y: rect.top + offsetY,
      left: rect.left + offsetX,
      top: rect.top + offsetY,
      width: rect.width,
      height: rect.height,
      right: rect.right + offsetX,
      bottom: rect.bottom + offsetY
    };
  };
  var getElementBoundingRect = function getElementBoundingRect(el) {
    var doc = document;
    var win = window;
    var body = doc.body;
    var result = getBoundingRect(el);
    var current = el;
    var parent = el.parentNode;

    do {
      if (parent && !parent.html && !parent.body && /absoute|relative|fixed/.test(win.getComputedStyle(parent).getPropertyValue("position"))) {
        var _getBoundingRect = getBoundingRect(parent),
            top = _getBoundingRect.top,
            left = _getBoundingRect.left;

        result.top -= top;
        result.left -= left;
        result.right = result.left + result.width;
        result.bottom = result.top + result.height;
        current = parent = null;
      } else if (!parent) {
        current = null;
      } else {
        current = parent;
        parent = current.parentNode;
      }
    } while (!!parent);

    return result;
  };

  var isAbsoluteNaN = function isAbsoluteNaN(it) {
    return it !== it && typeof it === "number";
  };
  var isNone = function isNone(data) {
    return isAbsoluteNaN(data) || data === undefined || data === null;
  };
  var isArray$1 = function isArray(data) {
    return Array.isArray(data) || data instanceof Array;
  };
  var isObject = function isObject(it) {
    return it !== null && typeof it === "object" ? true : false;
  };

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

    if (isArray$1(data)) {
      return data;
    }

    if (isNone(data)) {
      return isArray$1(defaultArray) ? defaultArray : isNone(defaultArray) ? [] : [defaultArray];
    }

    if (typeof data === "object" && typeof data.toArray === "function") {
      return data.toArray();
    }

    return [data];
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
              result[deepKey] = Object.assign(result[deepKey] || (isArray$1(obj[key]) ? [] : {}), obj[key], obj[deepKey]);
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
      console.error("faild parse url", e);
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
        query.substr(1).split("&").forEach(function (onePiece, i) {
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
      } else if (isArray$1(value)) {
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
    openTab: openTab,
    historyBack: historyBack,
    setLocalData: setLocalData,
    getLocalData: getLocalData,
    getBoundingRect: getBoundingRect,
    getElementBoundingRect: getElementBoundingRect,
    readUrl: readUrl,
    serialize: serialize,
    dragHelper: dragHelper,
    repeatHelper: repeatHelper
  });

  var DEFAULT = _objectSpread({}, helpers);

  return DEFAULT;

})));
//# sourceMappingURL=pado.web.js.map

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.array.from", "./query-finder"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.array.from"), require("./query-finder"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6Array, global.queryFinder);
    global.easy = mod.exports;
  }
})(this, function (_exports, _webDom, _es6Array, _queryFinder) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.predict = _exports.containsOut = _exports.containsIn = void 0;

  var getCurrentTarget = function getCurrentTarget(originalEvent, fallbackElement) {
    var result = originalEvent.currentTarget || originalEvent.target;
    return result && result.documentElement ? fallbackElement || result.documentElement : document.documentElement;
  };

  var isElementEvent = function isElementEvent(e) {
    return typeof e.stopPropagation === "function";
  };

  var getElementPosition = function getElementPosition(el) {
    var element = (0, _queryFinder.queryFind)(el, 0);
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
    var pos = getElementPosition(root);
    if (!pos) return;
    pos.x = (e.touches ? e.targetTouches[0].pageX : e.pageX) - pos.x;
    pos.y = (e.touches ? e.targetTouches[0].pageY : e.pageY) - pos.y;
    return pos;
  };

  var containsIn = function containsIn(container, subjects) {
    container = nodeList(container, 0);
    subjects = asArray(subjects);

    if (!subjects.length || !isNode(container) || subjects.some(function (subject) {
      return typeof subject === "string" ? false : !isNode(subject);
    })) {
      return false;
    }

    var allChildrens = null;

    var _loop = function _loop(i, l) {
      var selector = subjects[i];

      if (typeof selector === "string") {
        if (container.querySelector(selector)) {
          return {
            v: true
          };
        }
      } else {
        if (!allChildrens) allChildrens = Array.from(container.querySelectorAll("*"));

        if (allChildrens.some(function (child) {
          return child === selector;
        })) {
          return {
            v: true
          };
        }
      }
    };

    for (var i = 0, l = subjects.length; i < l; i++) {
      var _ret = _loop(i, l);

      if (typeof _ret === "object") return _ret.v;
    }

    return false;
  };

  _exports.containsIn = containsIn;

  var containsOut = function containsOut(container, subjects) {
    return containsIn(container, subjects);
  };

  _exports.containsOut = containsOut;

  var predict = function predict(container, option, root) {
    var element = nodeList(container, 0);
    if (!isNode(element)) return;

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
      middle: offsetTop + offsetHeight / 2 //if(isElementEvent(option)){
      //  const { x:left, y:top } = getPointerPosition(offset);
      //  option = { left, top };
      //}

    };

    if (isPlainObject(option)) {
      //console.log("option,",option)
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
  };

  _exports.predict = predict;
});
//# sourceMappingURL=easy.js.map
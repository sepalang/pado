(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.date.to-json", "../../modules/stance", "../../functions/isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.date.to-json"), require("../../modules/stance"), require("../../functions/isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Date, global.stance, global.isLike);
    global.dom = mod.exports;
  }
})(this, function (_exports, _es6Date, _stance, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.screenRect = _exports.windowRect = _exports.getElementBoundingRect = _exports.getElementOffsetRect = _exports.isElement = _exports.getNode = void 0;

  var getNode = function getNode(el) {
    var select = (0, _isLike.likeArray)(el) ? el[0] : el;
    return (0, _isLike.isNode)(select) ? select : undefined;
  };

  _exports.getNode = getNode;

  var isElement = function isElement(el) {
    return el instanceof Element;
  };

  _exports.isElement = isElement;

  var getElementOffsetRect = function getElementOffsetRect(el) {
    el = getNode(el);

    if (!isElement(el)) {
      return (0, _stance.rect)({
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

    return (0, _stance.rect)({
      x: offsetLeft,
      y: offsetTop,
      left: offsetLeft,
      top: offsetTop,
      width: offsetWidth,
      height: offsetHeight,
      valid: true
    });
  };

  _exports.getElementOffsetRect = getElementOffsetRect;

  var getBoundingRect = function getBoundingRect(el) {
    el = getNode(el);

    if (!isElement(el)) {
      return (0, _stance.rect)({
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

      while (parent && parent !== body) {
        offsetX += parent.scrollLeft;
        offsetY += parent.scrollTop;
        parent = parent.parentNode;
      }
    }

    return (0, _stance.rect)({
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
    el = getNode(el); //const doc  = document

    var win = window;
    var elRect = getBoundingRect(el).toJSON();

    if (elRect.valid === false) {
      return (0, _stance.rect)(elRect);
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
    } while (parent);

    return (0, _stance.rect)(elRect);
  };

  _exports.getElementBoundingRect = getElementBoundingRect;

  var windowRect = function windowRect() {
    return (0, _stance.rect)({
      left: window.screenLeft || window.screenX,
      top: window.screenTop || window.screenY,
      width: window.outerWidth,
      height: window.outerHeight
    });
  };

  _exports.windowRect = windowRect;

  var screenRect = function screenRect() {
    return (0, _stance.rect)({
      left: 0,
      top: 0,
      width: screen.width,
      height: screen.height
    });
  };

  _exports.screenRect = screenRect;
});
//# sourceMappingURL=dom.js.map
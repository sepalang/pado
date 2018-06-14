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
    global.dom = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getElementBoundingRect = _exports.getBoundingRect = void 0;

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

  _exports.getBoundingRect = getBoundingRect;

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

  _exports.getElementBoundingRect = getElementBoundingRect;
});
//# sourceMappingURL=dom.js.map
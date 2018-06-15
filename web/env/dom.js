(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.date.to-json", "../../modules/coordinate", "../../functions/isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.date.to-json"), require("../../modules/coordinate"), require("../../functions/isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Date, global.coordinate, global.isLike);
    global.dom = mod.exports;
  }
})(this, function (_exports, _es6Date, _coordinate, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getElementBoundingRect = _exports.getBoundingRect = _exports.isElement = _exports.getNode = void 0;

  var getNode = function getNode(el) {
    var select = (0, _isLike.likeArray)(el) ? el[0] : el;
    return (0, _isLike.isNode)(select) ? select : undefined;
  };

  _exports.getNode = getNode;

  var isElement = function isElement(el) {
    return el instanceof Element;
  };

  _exports.isElement = isElement;

  var getBoundingRect = function getBoundingRect(el) {
    el = getNode(el);

    if (!isElement(el)) {
      return (0, _coordinate.rect)({
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

    return (0, _coordinate.rect)({
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

  _exports.getBoundingRect = getBoundingRect;

  var getElementBoundingRect = function getElementBoundingRect(el) {
    el = getNode(el);
    var doc = document;
    var win = window;
    var body = doc.body;
    var sb = getBoundingRect(el);
    var elRect = getBoundingRect(el).toJSON();

    if (!elRect.valid) {
      return elRect;
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

    return (0, _coordinate.rect)(elRect);
  };

  _exports.getElementBoundingRect = getElementBoundingRect;
});
//# sourceMappingURL=dom.js.map
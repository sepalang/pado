(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/web.dom.iterable", "core-js/modules/es6.date.to-json", "../../modules/dimension", "../../functions/isLike"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/web.dom.iterable"), require("core-js/modules/es6.date.to-json"), require("../../modules/dimension"), require("../../functions/isLike"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webDom, global.es6Date, global.dimension, global.isLike);
    global.dom = mod.exports;
  }
})(this, function (_exports, _webDom, _es6Date, _dimension, _isLike) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.makeSVG = _exports.screenRect = _exports.windowRect = _exports.getElementBoundingRect = _exports.getBoundingRect = _exports.isElement = _exports.getNode = void 0;

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
      return (0, _dimension.rect)({
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

    return (0, _dimension.rect)({
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
    var elRect = getBoundingRect(el).toJSON();

    if (elRect.valid === false) {
      return (0, _dimension.rect)(elRect);
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

    return (0, _dimension.rect)(elRect);
  };

  _exports.getElementBoundingRect = getElementBoundingRect;

  var windowRect = function windowRect() {
    return (0, _dimension.rect)({
      left: window.screenLeft || window.screenX,
      top: window.screenTop || window.screenY,
      width: window.outerWidth,
      height: window.outerHeight
    });
  };

  _exports.windowRect = windowRect;

  var screenRect = function screenRect() {
    return (0, _dimension.rect)({
      left: 0,
      top: 0,
      width: screen.width,
      height: screen.height
    });
  };

  _exports.screenRect = screenRect;

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
          pathElement.setAttribute("fill", "transparent");
          pathElement.setAttribute("stroke", "gray");
          pathElement.setAttribute("stroke-width", "1");
          pathElement.setAttribute("stroke-linecap", "butt");
          pathElement.setAttribute("stroke-linejoin", "miter");
          var dValue = "";
          params.forEach(function (point, index) {
            var prefix = index === 0 ? 'M' : 'L';
            if (point.x > realMaxWidth) realMaxWidth = point.x;
            if (point.y > realMaxHeigth) realMaxHeigth = point.y;
            dValue += "" + prefix + point.x + " " + point.y + " ";
          });
          pathElement.setAttribute("d", dValue);
          svgTag.appendChild(pathElement);
        }
      });
      svgTag.setAttribute("width", realMaxWidth);
      svgTag.setAttribute("height", realMaxHeigth);
      return svgTag;
    }
  };

  var makeSVG = function makeSVG() {
    return new SVGBuilder();
  };

  _exports.makeSVG = makeSVG;
});
//# sourceMappingURL=dom.js.map
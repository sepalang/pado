(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.fill", "core-js/modules/web.dom.iterable"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.fill"), require("core-js/modules/web.dom.iterable"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array, global.webDom);
    global.svg = mod.exports;
  }
})(this, function (_exports, _es6Array, _webDom) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.makeSVG = _exports.svgPathWithVertex = void 0;

  var svgPathWithVertex = function svgPathWithVertex(vertex, close) {
    var dValue = "";
    vertex.forEach(function (point, index) {
      var prefix = index === 0 ? 'M' : 'L';
      dValue += "" + prefix + point.x + " " + point.y + " ";
    });

    if (!!dValue && close === true) {
      dValue += " Z";
    }

    return dValue;
  };

  _exports.svgPathWithVertex = svgPathWithVertex;

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
          params.forEach(function (point) {
            if (point.x > realMaxWidth) realMaxWidth = point.x;
            if (point.y > realMaxHeigth) realMaxHeigth = point.y;
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

  _exports.makeSVG = makeSVG;
});
//# sourceMappingURL=svg.js.map
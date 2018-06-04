(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.array.find"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.array.find"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Array);
    global.jquery = mod.exports;
  }
})(this, function (_exports, _es6Array) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  var $;

  try {
    window, document;
    $ = require('jquery');
  } catch (e) {
    var _jsdom = jsdom,
        JSDOM = _jsdom.JSDOM;
    var dom = new JSDOM('<html><head><meta charset="utf-8"></head><body></body></html>', {
      contentType: "text/html",
      userAgent: "Mellblomenator/9000",
      includeNodeLocations: true
    });
    global.window = dom.window;
    global.document = dom.document;
    $ = require('jquery');
  }

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
    offsetAll: function offsetAll() {
      var _this$eq = this.eq(0),
          element = _this$eq[0];

      var result;

      if (!element) {
        return;
      }

      if (element["innerWidth"]) {
        result = {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          right: window.innerWidth,
          bottom: window.innerHeight
        };
      } else {
        var offsetTop = element.offsetTop,
            offsetLeft = element.offsetLeft,
            offsetWidth = element.offsetWidth,
            offsetHeight = element.offsetHeight;
        result = {
          top: offsetTop,
          left: offsetLeft,
          width: offsetWidth,
          height: offsetHeight,
          right: offsetLeft + offsetWidth,
          bottom: offsetTop + offsetHeight
        };
      }

      return result;
    }
  });
  var _default = $;
  _exports.default = _default;
});
//# sourceMappingURL=jquery.js.map
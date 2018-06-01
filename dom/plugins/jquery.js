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
    $ = require('jquery');
  } catch (e) {
    try {
      $ = jQuery || $;

      if (!$) {
        throw new Error("No jQuery");
      }
    } catch (e2) {
      throw new Error("pado/dom sometimes requires jquery.");
    }
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
    }
  });
  var _default = $;
  _exports.default = _default;
});
//# sourceMappingURL=jquery.js.map
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./timeline", "./timeProperties"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./timeline"), require("./timeProperties"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.timeline, global.timeProperties);
    global.index = mod.exports;
  }
})(this, function (_exports, _timeline, _timeProperties) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "timeline", {
    enumerable: true,
    get: function get() {
      return _timeline.timeline;
    }
  });
  Object.defineProperty(_exports, "timeProperties", {
    enumerable: true,
    get: function get() {
      return _timeProperties.timeProperties;
    }
  });
});
//# sourceMappingURL=index.js.map
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
    global.timeProperties = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.timeProperties = void 0;

  //import { asArray } from '../functions'
  //import { timescaleExp } from '../functions/datetime'
  // 데이터를 배열로 지니고 있음
  // 데이터마다 간격과 속성만 지니고 있음 (시작시간은 없음)
  var TimeProperties = function TimeProperties(fps) {
    this._source = [];
    this._status = {
      timeStart: 0,
      timeEnd: 0
    };
    this._fps = 30;
    this._tick = 0;
    this._rate = 0;
    this._wheel = null;
    this._rightDirection = true;
    this.fps = fps;
  };

  var TimePropertiesPrototype = {
    emit: function emit() {},
    on: function on() {}
  };
  Object.defineProperties = {
    fps: {
      set: function set(fps) {
        this._fps = typeof fps === "number" ? fps : this._fps;
      },
      get: function get() {
        return this._fps;
      }
    },
    _interval: {
      get: function get() {
        return 1000 / this._fps;
      }
    }
  };
  TimeProperties.prototype = TimePropertiesPrototype;

  var timeProperties = function timeProperties(fps) {
    return new TimeProperties(fps);
  };

  _exports.timeProperties = timeProperties;
});
//# sourceMappingURL=timeProperties.js.map
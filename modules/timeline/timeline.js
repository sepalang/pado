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
    global.timeline = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.timeline = void 0;

  //import { asArray } from '../../functions'
  //import { timescaleExp } from '../../functions/datetime'
  // 시작시간등의
  var Timeline = function Timeline(fps) {
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

  var TimelinePrototype = {
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
  Timeline.prototype = TimelinePrototype;

  var timeline = function timeline(fps) {
    return new Timeline(fps);
  };

  _exports.timeline = timeline;
});
//# sourceMappingURL=timeline.js.map
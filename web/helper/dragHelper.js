(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../plugins/jquery", "../../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../plugins/jquery"), require("../../functions"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jquery, global.functions);
    global.dragHelper = mod.exports;
  }
})(this, function (_exports, _jquery, _functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = DragHelper;
  _jquery = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  //
  var DEVICE_EVENT = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch ? {
    START: 'touchstart',
    MOVE: 'touchmove',
    END: 'touchend'
  } : {
    START: 'mousedown',
    MOVE: 'mousemove',
    END: 'mouseup'
  }; //드래그

  var touchFixX;
  var touchFixY;

  var pointerParse = function pointerParse(_ref) {
    var clientX = _ref.clientX,
        clientY = _ref.clientY,
        touches = _ref.touches;

    if (touches) {
      if (!touches[0]) {
        return {
          x: touchFixX,
          y: touchFixY
        };
      }

      ;
      var _touches$ = touches[0],
          touchClientX = _touches$.clientX,
          touchClientY = _touches$.clientY;
      touchFixX = touchClientX;
      touchFixY = touchClientY;
      return {
        x: touchClientX,
        y: touchClientY
      };
    }

    return {
      x: clientX,
      y: clientY
    };
  };

  var preventDefaultFn = function preventDefaultFn(e) {
    return e.preventDefault();
  };

  function DragHelper(element, option) {
    var $element = (0, _jquery.default)(element).eq(0);
    var startFn;
    var moveFn;
    var endFn;
    var dragParams = null;
    var firstDrag = null;
    var lastDrag = null;

    var resetOptions = function resetOptions() {
      var getOptions = (0, _functions.rebase)(typeof option === "function" ? option({
        element: $element
      }) : option);
      startFn = getOptions["start"];
      moveFn = getOptions["move"];
      endFn = getOptions["end"];
    };

    var getCurrentPointerDrag = function getCurrentPointerDrag(originalEvent) {
      var pointerDrag = pointerParse(originalEvent); //현재 이동한 거리

      pointerDrag.moveX = pointerDrag.x - lastDrag.x;
      pointerDrag.moveY = pointerDrag.y - lastDrag.y; //처음으로부터 변경된 거리

      pointerDrag.offsetX = pointerDrag.x - firstDrag.x;
      pointerDrag.offsetY = pointerDrag.y - firstDrag.y; //처음으로 부터 변경되어 엘리먼트 오프셋 크기

      pointerDrag.leftValue = dragParams.offset.left + pointerDrag.offsetX;
      pointerDrag.topValue = dragParams.offset.top + pointerDrag.offsetY;
      pointerDrag.left = pointerDrag.leftValue + "px";
      pointerDrag.top = pointerDrag.topValue + pointerDrag.offsetY + "px";
      return pointerDrag;
    };

    var dragEnter = function dragEnter(_ref2) {
      var originalEvent = _ref2.originalEvent;
      //init
      resetOptions(); //

      var elementOffset = $element.predict();
      var pointerDrag = pointerParse(originalEvent);
      firstDrag = pointerDrag;
      lastDrag = pointerDrag;
      dragParams = {
        offset: elementOffset,
        pointer: undefined,
        event: originalEvent
      };
      dragParams.pointer = getCurrentPointerDrag(originalEvent);
      startFn && startFn(dragParams);
      (0, _jquery.default)(document).on(DEVICE_EVENT.MOVE, dragMove).on(DEVICE_EVENT.END, dragExit);
      (0, _jquery.default)(document.body).on(DEVICE_EVENT.MOVE, preventDefaultFn).attr("dragging", "");
    };

    var dragMove = function dragMove(_ref3) {
      var originalEvent = _ref3.originalEvent,
          preventDefault = _ref3.preventDefault;
      var pointerDrag = pointerParse(originalEvent);

      if (!moveFn) {
        lastDrag = pointerDrag;
        return;
      } else {
        dragParams.pointer = getCurrentPointerDrag(originalEvent);
        dragParams.event = originalEvent;
        moveFn(dragParams);
        lastDrag = pointerDrag;
      }
    };

    var dragExit = function dragExit(_ref4) {
      var originalEvent = _ref4.originalEvent;
      dragParams.pointer = getCurrentPointerDrag(originalEvent);
      dragParams.event = originalEvent;
      endFn && endFn(dragParams);
      dragParams = undefined;
      (0, _jquery.default)(document).off(DEVICE_EVENT.MOVE, dragMove).off(DEVICE_EVENT.END, dragExit);
      (0, _jquery.default)(document.body).off(DEVICE_EVENT.MOVE, preventDefaultFn).removeAttr("dragging");
    };

    $element.on(DEVICE_EVENT.START, dragEnter);
    return $element;
  }
});
//# sourceMappingURL=dragHelper.js.map
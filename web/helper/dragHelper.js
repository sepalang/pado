(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "jquery", "../../functions"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("jquery"), require("../../functions"));
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

  // eslint-disable-next-line no-undef
  var DEVICE_EVENT = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch ? {
    TOUCH_DEVICE: true,
    START: 'touchstart',
    MOVE: 'touchmove',
    END: 'touchend'
  } : {
    TOUCH_DEVICE: false,
    START: 'mousedown',
    MOVE: 'mousemove',
    END: 'mouseup' //

  };
  var dragRetainCount = 0; //

  var bindDraggingAttribute = function bindDraggingAttribute() {
    if (dragRetainCount > 0) {
      document.body.setAttribute("dragging", "");
    } else {
      document.body.removeAttribute("dragging");
    }
  }; //


  DEVICE_EVENT.TOUCH_DEVICE && window.addEventListener("touchmove", function (e) {
    dragRetainCount > 0 && e.preventDefault();
  }, {
    passive: false
  }); //드래그

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

  function DragHelper(element, option) {
    var $element = (0, _jquery.default)(element).eq(0);
    var dragElement = $element[0];
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

    var dragEnter = function dragEnter(originalEvent) {
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
      document.addEventListener(DEVICE_EVENT.MOVE, dragMove);
      document.addEventListener(DEVICE_EVENT.END, dragExit);
      dragRetainCount += 1;
      bindDraggingAttribute();
    };

    var dragMove = function dragMove(originalEvent) {
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

    var dragExit = function dragExit(originalEvent) {
      dragParams.pointer = getCurrentPointerDrag(originalEvent);
      dragParams.event = originalEvent;
      endFn && endFn(dragParams);
      dragParams = undefined;
      document.removeEventListener(DEVICE_EVENT.MOVE, dragMove);
      document.removeEventListener(DEVICE_EVENT.END, dragExit);
      dragRetainCount -= 1;
      bindDraggingAttribute();
    };

    dragElement.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });
    dragElement.addEventListener(DEVICE_EVENT.START, dragEnter);
    return $element;
  }
});
//# sourceMappingURL=dragHelper.js.map
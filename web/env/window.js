(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "core-js/modules/es6.function.name"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("core-js/modules/es6.function.name"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.es6Function);
    global.window = mod.exports;
  }
})(this, function (_exports, _es6Function) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.historyBack = _exports.openTab = _exports.closeWindow = _exports.openWindow = void 0;
  var WINDOW_POPUP_DEFAULT_WIDTH = 1100;
  var WINDOW_POPUP_DEFAULT_HEIGHT = 900;

  var openWindow = function openWindow(href, windowParam) {
    var hasParam = typeof windowParam === "object";
    var windowName = hasParam && windowParam["name"] || "_blank";
    var useResize = (hasParam && windowParam["resize"] + "") !== "false";
    var destWindowWidth = hasParam && windowParam["width"] || WINDOW_POPUP_DEFAULT_WIDTH;
    var destWindowHeight = hasParam && windowParam["height"] || WINDOW_POPUP_DEFAULT_HEIGHT;
    var destWindowTop = hasParam && windowParam["top"] || windowParam["y"] || 0;
    var destWindowLeft = hasParam && windowParam["left"] || windowParam["x"] || 0;
    var availMaxWidth = screen.availWidth;
    var availMaxHeight = screen.availHeight; // IE bottom bar

    if (navigator.platform.indexOf("Win") === 0) {
      availMaxHeight -= 65;
    }

    if (destWindowWidth > availMaxWidth) destWindowWidth = availMaxWidth;
    if (destWindowHeight > availMaxHeight) destWindowHeight = availMaxHeight;
    var newWindow = window.open(href, windowName, "top=" + destWindowTop + ",left=" + destWindowLeft + ",width=" + destWindowWidth + ",height=" + destWindowHeight + (useResize ? ",resizable=1" : ",resizable=0") + ",scrollbars=yes,status=1");
    return newWindow;
  };

  _exports.openWindow = openWindow;

  var closeWindow = function closeWindow() {
    window.close();
  };

  _exports.closeWindow = closeWindow;

  var openTab = function openTab(href) {
    var newWindow = window.open(href, '_blank');
    newWindow.focus();
    return newWindow;
  };

  _exports.openTab = openTab;

  var historyBack = function historyBack(_ref) {
    var catchFallback = _ref.catchFallback;

    try {
      var history = window.history;
      var initialPage = history.length < 2;

      if (initialPage && catchFallback) {
        if (typeof catchFallback === "string") {
          location.href = catchFallback;
        }

        if (typeof catchFallback === "function") {
          return catchFallback();
        }
      } else {
        history.back();
      }
    } catch (e) {
      return null;
    }
  };

  _exports.historyBack = historyBack;
});
//# sourceMappingURL=window.js.map
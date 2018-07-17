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
  _exports.historyBack = _exports.openTab = _exports.closeWindow = _exports.openWindow = _exports.windowProps = void 0;

  var _ref = function () {
    //to children
    var reservedSessionStorage = {}; //my window

    var pulledWindowToken;
    var pulledWindowSession;
    var openerPresenceProps; //(부모) 윈도우의 정보를 저장

    var windowServiceReserveSession = function windowServiceReserveSession(name, data, listenHandshake) {
      if (listenHandshake === true) {
        window.windowServiceHandshake = function () {
          delete window.windowServiceHandshake;
          return name;
        };
      }

      reservedSessionStorage[name] = data;
      return reservedSessionStorage[name];
    }; //자식에게 세션을 당겨올수 있도록 지원


    var windowServicePullSession = function windowServicePullSession(name) {
      //console.log("windowServicePullSession",name);
      var data = reservedSessionStorage[name];
      delete reservedSessionStorage[name];
      return data;
    }; //


    var getOpenerPresenceProperties = function getOpenerPresenceProperties() {
      if (typeof openerPresenceProps === "function") {
        return openerPresenceProps();
      }

      return openerPresenceProps;
    };

    window.windowServiceReserveSession = windowServiceReserveSession;
    window.windowServicePullSession = windowServicePullSession;

    try {
      if (window.opener && window.opener.windowServiceHandshake) {
        pulledWindowToken = window.opener.windowServiceHandshake();
      }
    } catch (e) {
      console.warn("window.opener.windowServiceHandshake error");
    }

    if (pulledWindowToken && window.opener && window.opener.windowServicePullSession) {
      pulledWindowSession = window.opener.windowServicePullSession(pulledWindowToken);
      openerPresenceProps = pulledWindowSession; //임의로 언로드 됐을때 세션을 임시 저장

      var saveSessionFn = function saveSessionFn() {
        try {
          window.opener && window.opener.windowServiceReserveSession && window.opener.windowServiceReserveSession(pulledWindowSession.token, pulledWindowSession, true);
        } catch (e) {
          console.warn("Parent window not found.", e);
        }
      };

      window.addEventListener("beforeunload", saveSessionFn);
    }

    return {
      windowServiceReserveSession: windowServiceReserveSession,
      getOpenerPresenceProperties: getOpenerPresenceProperties
    };
  }(),
      windowServiceReserveSession = _ref.windowServiceReserveSession,
      getOpenerPresenceProperties = _ref.getOpenerPresenceProperties;

  var windowProps = getOpenerPresenceProperties;
  _exports.windowProps = windowProps;
  var WINDOW_POPUP_DEFAULT_WIDTH = 1100;
  var WINDOW_POPUP_DEFAULT_HEIGHT = 900;

  var openWindow = function openWindow(href, windowParam) {
    var hasParam = typeof windowParam === "object";
    var windowName = hasParam && windowParam["name"] || "_blank";
    var useResize = (hasParam && windowParam["resize"] + "") !== "false";
    var windowProps = hasParam ? windowParam["props"] : undefined;
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
    windowServiceReserveSession(windowName, windowProps, true);
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

  var historyBack = function historyBack(_ref2) {
    var catchFallback = _ref2.catchFallback;

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
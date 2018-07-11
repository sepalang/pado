const { windowServiceReserveSession, getOpenerPresenceProperties } = (function(){
  //to children
  const reservedSessionStorage = {};
  
  //my window
  let pulledWindowToken;
  let pulledWindowSession;
  let openerPresenceProps;
  
  //(부모) 윈도우의 정보를 저장
  const windowServiceReserveSession = function(name,data,listenHandshake){
    if(listenHandshake === true){
      window.windowServiceHandshake = function(){
        delete window.windowServiceHandshake;
        return name;
      };
    }
    reservedSessionStorage[name] = data;
    return reservedSessionStorage[name];
  };

  //자식에게 세션을 당겨올수 있도록 지원
  const windowServicePullSession = function(name){
    //console.log("windowServicePullSession",name);
    var data = reservedSessionStorage[name];
    delete reservedSessionStorage[name];
    return data;
  };
  
  //
  const getOpenerPresenceProperties = function(){
    if(typeof openerPresenceProps === "function"){
      return openerPresenceProps()
    }
    return openerPresenceProps;
  };
  
  window.windowServiceReserveSession = windowServiceReserveSession;
  window.windowServicePullSession    = windowServicePullSession;

  try {
    if(window.opener && window.opener.windowServiceHandshake){
      pulledWindowToken = window.opener.windowServiceHandshake();
    }
  } catch(e){
    console.warn("window.opener.windowServiceHandshake error");
  }
    
  if(pulledWindowToken && window.opener && window.opener.windowServicePullSession){
    pulledWindowSession  = window.opener.windowServicePullSession(pulledWindowToken);
    openerPresenceProps = pulledWindowSession;
    
    //임의로 언로드 됐을때 세션을 임시 저장
    var saveSessionFn = function(){
      try {
        window.opener &&
        window.opener.windowServiceReserveSession &&
        window.opener.windowServiceReserveSession(pulledWindowSession.token,pulledWindowSession,true);
      } catch(e) {
        console.warn("Parent window not found.",e);
      }
    };
    
    window.addEventListener("beforeunload",saveSessionFn);
  }
  
  return { windowServiceReserveSession, getOpenerPresenceProperties };
}());

export const windowProps = getOpenerPresenceProperties;

const WINDOW_POPUP_DEFAULT_WIDTH = 1100;
const WINDOW_POPUP_DEFAULT_HEIGHT = 900;

export const openWindow = function(href, windowParam) {
  const hasParam    = typeof windowParam === "object";
  const windowName  = hasParam && windowParam["name"] || "_blank";
  const useResize   = (hasParam && windowParam["resize"]+"") !== "false";
  const windowProps = hasParam ? windowParam["props"] : undefined;
  
  let destWindowWidth  = (hasParam && windowParam["width"] || WINDOW_POPUP_DEFAULT_WIDTH);
  let destWindowHeight = (hasParam && windowParam["height"] || WINDOW_POPUP_DEFAULT_HEIGHT);
  let destWindowTop    = (hasParam && windowParam["top"] || windowParam["y"] || 0);
  let destWindowLeft   = (hasParam && windowParam["left"] || windowParam["x"] || 0);

  const availMaxWidth = screen.availWidth;
  let availMaxHeight = screen.availHeight;

  // IE bottom bar
  if(navigator.platform.indexOf("Win") === 0) {
    availMaxHeight -= 65;
  }

  if(destWindowWidth > availMaxWidth) destWindowWidth = availMaxWidth;
  if(destWindowHeight > availMaxHeight) destWindowHeight = availMaxHeight;
  
  windowServiceReserveSession(windowName,windowProps,true);
  
  const newWindow = window.open(
    href,
    windowName,
    `top=${destWindowTop},left=${destWindowLeft},width=${destWindowWidth},height=${destWindowHeight}${useResize ? ",resizable=1" : ",resizable=0"},scrollbars=yes,status=1`
  );

  return newWindow;
};

export const closeWindow = function(){
  window.close();
};

export const openTab = function(href) {
  const newWindow = window.open(href, '_blank');
  newWindow.focus();
  return newWindow;
};

export const historyBack = function({ catchFallback }) {
  try {
    const history = window.history;
    const initialPage = history.length < 2;

    if(initialPage && catchFallback) {
      if(typeof catchFallback === "string") {
        location.href = catchFallback;
      }
      if(typeof catchFallback === "function") {
        return catchFallback();
      }
    } else {
      history.back();
    }
  } catch (e) {
    return null;
  }
};
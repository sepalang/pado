const WINDOW_POPUP_DEFAULT_WIDTH = 1100;
const WINDOW_POPUP_DEFAULT_HEIGHT = 900;

export const openWindow = function(href, windowParam) {
  const hasParam   = typeof windowParam === "object";
  const windowName = hasParam && windowParam["name"] || "_blank";
  const useResize  = (hasParam && windowParam["resize"]+"") !== "false";
  
  let destWindowWidth  = (hasParam && windowParam["width"] || WINDOW_POPUP_DEFAULT_WIDTH);
  let destWindowHeight = (hasParam && windowParam["height"] || WINDOW_POPUP_DEFAULT_HEIGHT);

  const availMaxWidth = screen.availWidth;
  let availMaxHeight = screen.availHeight;

  // IE bottom bar
  if(navigator.platform.indexOf("Win") === 0) {
    availMaxHeight -= 65;
  }

  if(destWindowWidth > availMaxWidth) destWindowWidth = availMaxWidth;
  if(destWindowHeight > availMaxHeight) destWindowHeight = availMaxHeight;

  const newWindow = window.open(
    href,
    windowName,
    `width=${destWindowWidth},height=${destWindowHeight}${useResize ? ",resizable=1" : ""},scrollbars=yes,status=1`
  );

  return newWindow;
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
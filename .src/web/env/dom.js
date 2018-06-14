export const getAbsoluteBoundingRect = function (el) {
  const doc = document;
  const win = window;
  const body = doc.body;

  offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
  (doc.documentElement || body.parentNode || body).scrollLeft,
  offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
  (doc.documentElement || body.parentNode || body).scrollTop,

  rect = el.getBoundingClientRect();

  if (el !== body) {
    var parent = el.parentNode;

    while (parent !== body) {
      offsetX += parent.scrollLeft;
      offsetY += parent.scrollTop;
      parent   = parent.parentNode;
    }
  }

  return {
    bottom: rect.bottom + offsetY,
    height: rect.height,
    left  : rect.left + offsetX,
    right : rect.right + offsetX,
    top   : rect.top + offsetY,
    width : rect.width
  };
}
export const getBoundingRect = function(el){
  const doc = document;
  const win = window;
  const body = doc.body;

  let offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
  (doc.documentElement || body.parentNode || body).scrollLeft;
  let offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
  (doc.documentElement || body.parentNode || body).scrollTop;

  const rect = el.getBoundingClientRect();

  if (el !== body) {
    var parent = el.parentNode;

    while (parent !== body) {
      offsetX += parent.scrollLeft;
      offsetY += parent.scrollTop;
      parent   = parent.parentNode;
    }
  }

  return {
    x     : rect.left + offsetX,
    y     : rect.top + offsetY,
    left  : rect.left + offsetX,
    top   : rect.top + offsetY,
    width : rect.width,
    height: rect.height,
    right : rect.right + offsetX,
    bottom: rect.bottom + offsetY
  };
}

export const getElementBoundingRect = function(el){
  const doc  = document;
  const win  = window;
  const body = doc.body;
  const result = getBoundingRect(el);
  
  let current = el;
  let parent  = el.parentNode;
  
  do {
    if(parent && (!parent.html && !parent.body)  && /absoute|relative|fixed/.test(win.getComputedStyle(parent).getPropertyValue("position"))){
      const { top, left } = getBoundingRect(parent);
      result.top   -= top;
      result.left  -= left;
      result.right  = result.left + result.width;
      result.bottom = result.top + result.height;
      current = parent = null;
    } else if(!parent) {
      current = null;
    } else {
      current = parent;
      parent = current.parentNode;
    }
  } while( !!parent )
  
  return result;
}
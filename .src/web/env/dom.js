import { rect } from "../../modules/coordinate";
import { likeArray, isNode } from "../../functions/isLike";

export const getNode = function(el){
  let select = likeArray(el) ? el[0] : el;
  return isNode(select) ? select : undefined;
};

export const isElement = function(el){
  return el instanceof Element;
};

export const getBoundingRect = function(el){
  el = getNode(el);
  
  if(!isElement(el)){
    return rect({
      x:0,y:0,left:0,top:0,width:0,height:0,right:0,bottom:0,valid:false
    });
  }
  
  const doc = document;
  const win = window;
  const body = doc.body;

  let offsetX = win.pageXOffset !== undefined ? win.pageXOffset :
  (doc.documentElement || body.parentNode || body).scrollLeft;
  let offsetY = win.pageYOffset !== undefined ? win.pageYOffset :
  (doc.documentElement || body.parentNode || body).scrollTop;
  
  const boundingRect = el.getBoundingClientRect();

  if (el !== body) {
    var parent = el.parentNode;

    while (parent !== body) {
      offsetX += parent.scrollLeft;
      offsetY += parent.scrollTop;
      parent   = parent.parentNode;
    }
  }
  
  return rect({
    x     : boundingRect.left + offsetX,
    y     : boundingRect.top + offsetY,
    left  : boundingRect.left + offsetX,
    top   : boundingRect.top + offsetY,
    width : boundingRect.width,
    height: boundingRect.height,
    right : boundingRect.right + offsetX,
    bottom: boundingRect.bottom + offsetY,
    valid : true
  });
}

export const getElementBoundingRect = function(el){
  el = getNode(el);
  
  const doc  = document;
  const win  = window;
  const body = doc.body;
  
  const sb = getBoundingRect(el);
  
  const elRect = getBoundingRect(el).toJSON();
  
  if(!elRect.valid){
    return elRect;
  }
  
  let current = el;
  let parent  = el.parentNode;
  
  do {
    if(parent && (!parent.html && !parent.body)  && /absoute|relative|fixed/.test(win.getComputedStyle(parent).getPropertyValue("position"))){
      const { top, left } = getBoundingRect(parent);
      elRect.top   -= top;
      elRect.left  -= left;
      elRect.right  = elRect.left + elRect.width;
      elRect.bottom = elRect.top + elRect.height;
      current = parent = null;
    } else if(!parent) {
      current = null;
    } else {
      current = parent;
      parent = current.parentNode;
    }
  } while( !!parent )
  
  return rect(elRect);
}
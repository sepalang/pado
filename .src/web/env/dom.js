import { rect } from "../../modules/dimension";
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
  
  const elRect = getBoundingRect(el).toJSON();
  
  if(elRect.valid === false){
    return rect(elRect);
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

export const windowRect = function(){
  return rect({
    left:window.screenLeft || window.screenX,
    top:window.screenTop || window.screenY,
    width:window.outerWidth,
    height:window.outerHeight
  });
}

export const screenRect = function(){
  return rect({
    left:0,
    top:0,
    width:screen.width,
    height:screen.height
  });
}

const SVGBuilder = function(){
  this.drawVariants = [];
};

SVGBuilder.prototype = {
  addPath (points,attributes){
    this.drawVariants.push({
      tag:"path",
      attributes,
      params:points
    })
    return this;
  },
  createElement (){
    const svgTag = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    let realMaxWidth  = 0;
    let realMaxHeigth = 0; 
    
    this.drawVariants.forEach(({ tag, attributes, params})=>{
      if( tag === "path"){
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', "path");
        pathElement.setAttribute("fill","transparent");
        pathElement.setAttribute("stroke","gray");
        pathElement.setAttribute("stroke-width","1");
        pathElement.setAttribute("stroke-linecap","butt");
        pathElement.setAttribute("stroke-linejoin","miter");
        
        let dValue = "";
        
        params.forEach((point, index)=>{
          const prefix = index === 0 ? 'M' : 'L';
          if(point.x > realMaxWidth) realMaxWidth = point.x;
          if(point.y > realMaxHeigth) realMaxHeigth = point.y;
          dValue += `${prefix}${point.x} ${point.y} `;
        });
        
        pathElement.setAttribute("d",dValue);
        svgTag.appendChild(pathElement);
      }
    });
    
    svgTag.setAttribute("width",realMaxWidth);
    svgTag.setAttribute("height",realMaxHeigth);
    return svgTag;
  }
}

export const makeSVG = function(){
  return new SVGBuilder();
}
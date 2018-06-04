import { isPlainObject } from '../../functions';

let $;

try {
  (window,document);
  $ = require('jquery');
} catch(e){
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<html><head><meta charset="utf-8"></head><body></body></html>',{
    contentType: "text/html",
    userAgent: "Mellblomenator/9000",
    includeNodeLocations: true
  });
  global.window = dom.window;
  global.document = dom.document;
  $ = require('jquery');
}

const isPointerEvent = $.isPointerEvent = function (e){
  
}

const getOriginalEvent = $.getOriginalEvent = function(e){
  
};

const getElementPosition = $.getElementPosition = function(el){
  let [ element ] = $(el);
  
  if(!element) return null;
  
  let xPosition = 0, yPosition = 0;
  while(element){
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    yPosition += (element.offsetTop  - element.scrollTop  + element.clientTop );
    element = element.offsetParent;
  }
  return {x:xPosition,y:yPosition};
}


const getPointerPosition = $.getPointerPosition = function(e, root){
  root = !root ? document.documentElement : root;

  const evt = getOriginalEvent(e);
  const pos = getElementPosition(root);
  if(!pos) return;
  
  pos.x = e.touches ? e.touches[0].pageX : e.clientX - pos.x;
  pos.y = e.touches ? e.touches[0].pageY : e.clientY - pos.y;
  return pos;
}

$.fn.extend({
  //파라메터 노드가 제이쿼리가 가진 노드 안에 있는지 확인
  containsIn (node){
    var [ target ] = $(node).eq(0);
    if(target) for(var i=0,l=this.length;i<l;i++){
      if(this[i] === target) return true;
      if(this.eq(i).find(target).length) return true;
    }
    return false;
  },
  //파라메터 노드가 제이쿼리가 가진 노드 밖에 있는지 확인
  containsOut (node){
    return !this.containsIn(node);
  },
  /*
    //
    $(window).predict()
    $(window).predict({center:20});
    $(window).predict({center:event});
    
    //TODO
    $(window).predict(element)
    $(window).predict(element, {center:20});
  */
  predict (offset){
    const [ element ] = this.eq(0);
    if(!element) return;
    
    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = element["innerWidth"] ? {
      offsetTop   :0, 
      offsetLeft  :0, 
      offsetWidth :window.innerWidth, 
      offsetHeight:window.innerHeight
    } : element;
    
    const result = {
      top   :offsetTop,
      left  :offsetLeft,
      width :offsetWidth,
      height:offsetHeight,
      right :offsetLeft + offsetWidth,
      bottom:offsetTop + offsetHeight,
      center:(offsetWidth + offsetLeft) / 2,
      middle:(offsetHeight + offsetTop) / 2
    };
      
    if(isPointerEvent(offset)){
      const { x:left, y:top } = getPointerPosition(offset);
      offset = { left, top };
    }
      
    if(offset && isPlainObject(offset)){
      ["top", "left", "width", "height", "right", "bottom", "center", "middle"].forEach((key)=>{
        if(typeof offset[key] !== "number") return;
          
        let equalize;
          
        switch(key){
        case "top":
        case "middle":
          equalize = ["y", offset[key] - result[key]];
          break;
        case "left":
        case "center":
          equalize = ["x", offset[key] - result[key]];
          break;
        case "width":
          equalize = ["width", offset[key] - result[key]];
          break;
        case "height":
          equalize = ["height", offset[key] - result[key]];
          break;
        case "right":
          break;
        case "bottom":
          break;
        }
          
        switch(equalize && equalize[0]){
        case "x":
          result["left"]   += equalize[1];
          result["center"] += equalize[1];
          result["right"]  += equalize[1];
          break;
        case "y":
          result["top"]    += equalize[1];
          result["middle"] += equalize[1];
          result["bottom"] += equalize[1];
          break;
        case "width":
          result["width"]  += equalize[1];
          result["right"]  += equalize[1];
          result["center"] += (result["right"] - result["left"] / 2);
          break;
        case "height":
          result["height"] += equalize[1];
          result["bottom"] += equalize[1];
          result["middle"] += (result["bottom"] - result["top"] / 2);
          break;
        }
      });
    }
    
    return result;
  }
});

export default $;
import { isPlainObject } from '../../functions';

const $ = require('jquery');

const getCurrentTarget = function(originalEvent, fallbackElement){
  let result = originalEvent.currentTarget || originalEvent.target;
  return (result && result.documentElement) ? (fallbackElement || result.documentElement) : document.documentElement;
}

const isElementEvent = $.isElementEvent = function (e){
  return typeof e.stopPropagation === "function";
}

const getElementPosition = $.getElementPosition = function(el){
  let [ element ] = $(el);
  
  if(!element) return null;
  
  let xPosition = 0;
  let yPosition = 0;
  
  while(element && !element.documentElement){
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    yPosition += (element.offsetTop  - element.scrollTop  + element.clientTop );
    element   = element.offsetParent;
  }
  
  return {x:xPosition,y:yPosition};
}


const getPointerPosition = $.getPointerPosition = function(e, root){
  
  root = !root ? document.documentElement : root;

  const pos = getElementPosition(root);
  
  if(!pos) return;
  
  pos.x = (e.touches ? e.targetTouches[0].pageX : e.pageX) - pos.x;
  pos.y = (e.touches ? e.targetTouches[0].pageY : e.pageY) - pos.y;
  
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
  predict (option,root){
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
      center:offsetLeft + offsetWidth / 2,
      middle:offsetTop + offsetHeight / 2
    };
    
    
    //if(isElementEvent(option)){
    //  const { x:left, y:top } = getPointerPosition(offset);
    //  option = { left, top };
    //}
      
    if(isPlainObject(option)){
      //console.log("option,",option)
      const allProps = ["top", "left", "width", "height", "right", "bottom", "center", "middle"].filter(key=>option.hasOwnProperty(key));
      
      //event option
      allProps.forEach((key)=>{
        const optionOfKey = option[key]
        if(!isElementEvent(optionOfKey)) return;
        const pointerPosition = getPointerPosition(optionOfKey,root || getCurrentTarget(optionOfKey, element) || element);
        if(!pointerPosition) return;
        
        if(/left|width|right|center/.test(key)){
          option[key] = pointerPosition["x"]
        }
        
        if(/top|middle|bottom|height/.test(key)){
          option[key] = pointerPosition["y"]
        }
      });
      
      allProps.forEach((key)=>{
        if(typeof option[key] !== "number") return;

        const valueOfKey = result[key];  
        let equalize;
        
        switch(key){
        case "top":
        case "middle":
          equalize = ["y", option[key] - valueOfKey];
          break;
        case "left":
        case "center":
          equalize = ["x", option[key] - valueOfKey];
          break;
        case "width":
          equalize = ["width", option[key] - valueOfKey];
          break;
        case "height":
          equalize = ["height", option[key] - valueOfKey];
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
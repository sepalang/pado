import $ from '../plugins/jquery';
import { rebase } from '../../functions';


//드래그
let touchFixX;
let touchFixY;
const pointerParse = ({ clientX, clientY, touches })=>{
  if(touches){
    if(!touches[0]){
      return {
        x:touchFixX,
        y:touchFixY
      }
    };
    
    const { clientX:touchClientX, clientY:touchClientY } = touches[0];
    touchFixX = touchClientX;
    touchFixY = touchClientY;
    
    return {
      x:touchClientX,
      y:touchClientY
    };
  }
  return {
    x:clientX,
    y:clientY
  };
};

const preventDefaultFn = (e)=>e.preventDefault();

export default function DragHelper(element,option){
  const $element = $(element).eq(0);
  let startFn;
  let moveFn;
  let endFn;
  
  let dragParams = null;
  let firstDrag  = null;
  let lastDrag   = null;
  
  const resetOptions = function(){
    const getOptions = rebase(typeof option === "function" ? option({ element:$element }) : option);
    startFn = getOptions["start"];
    moveFn = getOptions["move"];
    endFn = getOptions["end"];
  };
  
  const getCurrentPointerDrag = function(originalEvent){
    const pointerDrag = pointerParse(originalEvent);
  
    //현재 이동한 거리
    pointerDrag.moveX = pointerDrag.x - lastDrag.x;
    pointerDrag.moveY = pointerDrag.y - lastDrag.y;
    
    //처음으로부터 변경된 거리
    pointerDrag.offsetX = pointerDrag.x - firstDrag.x;
    pointerDrag.offsetY = pointerDrag.y - firstDrag.y;
    
    //처음으로 부터 변경되어 엘리먼트 오프셋 크기
    pointerDrag.leftValue = dragParams.offset.left + pointerDrag.offsetX;
    pointerDrag.topValue  = dragParams.offset.top + pointerDrag.offsetY;
    
    pointerDrag.left = pointerDrag.leftValue + "px";
    pointerDrag.top  = pointerDrag.topValue + pointerDrag.offsetY + "px";
    
    return pointerDrag;
  }
  
  const dragEnter = function({ originalEvent }){
    //init
    resetOptions();
    
    //
    const elementOffset = $element.predict();
    const pointerDrag   = pointerParse(originalEvent);
    
    firstDrag = pointerDrag;
    lastDrag  = pointerDrag;
    
    dragParams = { offset:elementOffset, pointer:undefined, event:originalEvent };
    dragParams.pointer = getCurrentPointerDrag(originalEvent);
    
    startFn && startFn(dragParams);
    
    $(document)
    .on("mousemove touchmove",dragMove)
    .on("mouseup touchend",dragExit);
    
    $(document.body)
    .on("mousemove touchmove",preventDefaultFn)
    .attr("dragging", "");
  };
  
  const dragMove = function({ originalEvent, preventDefault }){
    
    const pointerDrag = pointerParse(originalEvent);
    if(!moveFn){
      lastDrag = pointerDrag;
      return;
    } else {
      dragParams.pointer = getCurrentPointerDrag(originalEvent);
      dragParams.event   = originalEvent;
      moveFn(dragParams);
      lastDrag = pointerDrag;
    }
  };
  
  const dragExit = function({ originalEvent }){
    dragParams.pointer = getCurrentPointerDrag(originalEvent);
    dragParams.event   = originalEvent;
    endFn && endFn(dragParams);
    dragParams = undefined;
    
    $(document)
    .off("mousemove touchmove",dragMove)
    .off("mouseup touchend",dragExit);
    
    $(document.body)
    .off("mousemove touchmove",preventDefaultFn)
    .removeAttr("dragging");
  };
  
  $element.on("mousedown touchstart",dragEnter);
  
  return $element;
}
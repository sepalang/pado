import $ from '../plugins/jquery';
import { rebase } from '../../functions';

//드래그
const pointerParse = ({ clientX, clientY })=>{
  return {
    x:clientX,
    y:clientY
  };
};

export default function DragHelper(element,option){
  const $element = $(element).eq(0);
  const delegates = [];
  let startFn;
  let moveFn;
  let endFn;
  
  let dragParams = null;
  let firstDrag  = null;
  let lastDrag   = null;
  
  const resetOptions = function(){
    const delegate = (delegateElement)=>{
      $(delegateElement).each(function(){
        delegates.push(this);
        $(this).css("pointer-events","none");
      });
    };
    
    const getOptions = rebase(typeof option === "function" ? option({ element:$element, delegate }) : option);
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
    .on("mousemove",dragMove)
    .on("mouseup",dragExit);
    
    $("body").attr("dragging", "");
  };
  
  const dragMove = function({ originalEvent }){
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
    .off("mousemove",dragMove)
    .off("mouseup",dragExit);
    
    $("body").removeAttr("dragging");
  };
  
  $element.on("mousedown",dragEnter);
  
  return $element;
}
import $ from '../plugins/jquery';

//드래그
const pointerParse = ({ clientX, clientY })=>{
  return {
    x:clientX,
    y:clientY
  };
};

export default function DragHelper(element,option){
  const $element = $(element).eq(0);
  
  let startFn;
  let moveFn;
  let endFn;
  
  let dragParams = null;
  let firstDrag  = null;
  let lastDrag   = null;
  
  const resetOptions = function(){
    const getOptions = (typeof option === "function" ? option($element) : option);
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
    pointerDrag.left = dragParams.offset.left + pointerDrag.offsetX + "px";
    pointerDrag.top  = dragParams.offset.top + pointerDrag.offsetY + "px";
    
    return pointerDrag;
  }
  
  const dragEnter = function({ originalEvent }){
    //init
    resetOptions();
    
    //
    const elementOffset = $element.offsetAll();
    const pointerDrag   = pointerParse(originalEvent);
    
    firstDrag = pointerDrag;
    lastDrag  = pointerDrag;
    
    dragParams = { offset:elementOffset, pointer:undefined };
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
      moveFn(dragParams);
      lastDrag = pointerDrag;
    }
  };
  
  const dragExit = function({ originalEvent }){
    dragParams.pointer = getCurrentPointerDrag(originalEvent);
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
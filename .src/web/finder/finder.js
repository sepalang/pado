import { unique } from '../../functions/functions'
import { asArray, toArray } from '../../functions/cast'
import { isPlainObject, isArray, isNode } from '../../functions/isLike'
import { is, query, nodelist } from './query-selector'

const findLite = function(find){
  if( typeof find === 'string' ){
    // [string,null]
    return query(find);
  } else if(isNode(find)){
    // [node]
    return [find];
  }  else if(isArray(find)) {
    // [array]
    var fc = [];
    for(var i=0,l=find.length;i<l;i++) { 
      if( typeof find[i] === 'string' ) {
        // [array][string]
        var fs = query(find[i]);
        if(fs.length) fc = fc.concat( fs );
      } else if(isNode(find[i])) {
        // [array][node]
        fc.push(find[i]);
      } else if(isArray(find[i])){
        var fa = findLite(find[i]);
        if(fa.length) fc = fc.concat( fa );
      }
    }
    return unique(fc);
  }
  return [];
};
//여러개의 셀럭터와 하나의 루트노드만 허용
const findByOnePlace = function(findse,rootNode){
  if(typeof findse === 'string') return query(findse,rootNode);
  if( isNode(findse) ) {
    var fs = query(N.node.trace(findse),rootNode);
    for(var i=0,l=fs.length;i<l;i++) if(findse === fs[i]) return [findse];
  }
  if( isArray(findse) ) {
    var result = [];
    for(var i=0,l=findse.length;i<l;i++) {
      var fd = findByOnePlace(findse[i],rootNode);
      if( fd.length ) result = result.concat(fd);
    }				
    return unique(result);
  }
  return [];
};
//다수의 로트와 샐렉터를 받고 출력
const findBySeveralPlaces = function(find,root){
  if(arguments.length === 1 || typeof root === 'undefined' || root === null || root === W.document ) return findLite(find);
  // find root
  var targetRoots = findLite(root);
  if(targetRoots.length === 0) {
    return findLite(find);
  }
  //
  var findes = toArray(find);
  var result = [];
  for(var i=0,l=targetRoots.length;i<l;i++) {
    for(var fi=0,fl=findes.length;fi<fl;fi++) {
      var fdr = findByOnePlace(findes[fi],targetRoots[i]);
      if( fdr.length ) result = result.concat(fdr);
    }
  }
  return unique(result);
};

//최적화 분기하여 샐랙터를 실행시킴
export const find = function(find,root,eq){
  return (typeof root === "number") ? findLite(find)[root] :
  (typeof eq === "number")   ? findBySeveralPlaces(find,root)[eq] :
  findBySeveralPlaces(find,root);
};

export const findMember = function(sel,offset){
  var target = findLite(sel)[0];
  if(!isNode(target)) return;
  if(typeof offset !== "number") return toArray(target.parentElement.children);
  var currentIndex = -1;
  Array.from(target.parentNode.children).forEach((node,i)=>{ if(target == node) { currentIndex = i; return false; } });
  return target.parentNode.children[currentIndex+offset];
};

const getCurrentTarget = function (originalEvent, fallbackElement){
  let result = originalEvent.currentTarget || originalEvent.target
  return (result && result.documentElement) ? (fallbackElement || result.documentElement) : document.documentElement
}

const isElementEvent = function (e){
  return typeof e.stopPropagation === "function"
}

const getElementPosition = function (el){
  let element = find(el, 0);
  
  if(!element) return null
  
  let xPosition = 0
  let yPosition = 0
  
  while(element && !element.documentElement){
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft)
    yPosition += (element.offsetTop - element.scrollTop + element.clientTop)
    element = element.offsetParent
  }
  
  return {x: xPosition, y: yPosition}
}


const getPointerPosition = $.getPointerPosition = function (e, root){
  root = !root ? document.documentElement : root

  const pos = getElementPosition(root)
  
  if(!pos) return
  
  pos.x = (e.touches ? e.targetTouches[0].pageX : e.pageX) - pos.x
  pos.y = (e.touches ? e.targetTouches[0].pageY : e.pageY) - pos.y
  
  return pos
}
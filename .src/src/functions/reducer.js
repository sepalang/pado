import { 
  isArray,
  isNumber,
  isEmpty,
  likeRegexp,
  likeString,
  likeObject
} from './isLike'

import {
  asArray
} from './cast'

import {
  all
} from './enumerator'

import _get from 'lodash/get';

export const castString = function(text,matches,castFn,property){
  let cursorStart = isNumber(property.start) && property.start > 0 ? property.start : 0;
  let cursorEnd   = isNumber(property.end) ? property.end : text.length;
  let cursor      = cursorStart;
  
  const open = function({ cursorStart, cursorEnd, cursor, matches }){
    matches.map(matchExp=>{
      //matchExp()
    })
  };
  
  open({
    cursorStart,
    cursorEnd,
    cursor,
    matches
  })
  
  
  
  return property;
};

export const castPath = function(pathParam){
  if(isArray(pathParam)){
    return pathParam;
  }
  if(likeString(pathParam)){
    if(isNumber(pathParam)){
      return [pathParam]
    }
    if(typeof pathParam === "string"){
      const { meta:{ result } } = castString(pathParam,[".","["],({ property:{ meta }, matchType, match, casting, fork, nextIndex, next, skip })=>{
        switch(matchType){
        // "."
        case 0:
          meta.push(casting);
          next(nextIndex);
          break;
        // "]"
        case 1:
          let [lead, feet] = [1, 0];
          
          fork(["[","]"],({ matchType, match, casting, nextIndex , next, skip })=>{
            matchType === 0 && lead++;
            matchType === 1 && feet++;
            
            if(lead === feet){
              meta.push(casting.substr(1))
              next(nextIndex);
            } else {
              skip();
            }
          });
          break;
        //end
        case -1:
          meta.push(casting);
          break;
        default:
          skip();
          break;
        }
        skip();
      },{meta:[]});
      
      return result;
    }
  }
  return [];
};

export const get = function(target,path){
  if(typeof target === "object"){
    switch(typeof path){
      case "number": path += "";
      case "string": return path.indexOf("[") == 0 ? eval("target"+path) : eval("target."+path);
      case "function": return path.call(this,target);
    }
  } else if(typeof target === "function"){
    return target.apply(this,Array.prototype.slice.call(arguments,1));
  }
  return target;
}

export const hasProperty = function(target,pathParam){
  return all(castPath(pathParam),path=>{
    if(likeObject(target) && likeString(path) && target.hasOwnProperty(path)){
      target = target[path];
      return true;
    }
    return false;
  });
}

export const hasValueProperty = function(obj,value,key){
  if(arguments.length == 1 && likeObject(obj)) return isEmpty(obj);
  if(isArray(obj)) for(var i=0,l=obj.length;i<l;i++) if(obj[i] === value) return true;
  if(likeObject(obj)){
    if(key){
      return _get(obj,key) === value;
    } else {
      for(var key in obj) if(_get(obj,key) === value) return true;
    }
  }
  return false;
};

export const turn = function(i, p, ts) {
  if(i < 0) { var abs = Math.abs(i / ts); i = p - (abs > p ? abs % p : abs); }
  ts = ts || 1; i = Math.floor(i / ts);
  return (p > i) ? i : i % p;
};

export const max = function(numberList){
  let result;
  asArray(numberList).forEach(n=>{
    if(isNumber(n)){
      if(typeof result !== "number"){
        result = n;
        return;
      } 
      if(result < n){
        result = n;
      }
    }
  })
  return result;
};
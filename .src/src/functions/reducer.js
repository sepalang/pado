import { 
  isArray,
  isInfinity,
  isNumber,
  isEmpty,
  likeRegexp,
  likeString,
  likeObject
} from './isLike'

import {
  asArray,
  castPath
} from './cast'

import {
  all
} from './enumerable'

//reducer.spec.js
export const matchString = (it,search,at=0)=>{
  if(typeof it !== "string") throw new Error(`matchString :: worng argument ${it}`);
  if(typeof search === "string") search = search.replace(new RegExp("(\\.|\\[|\\])","g"),s=>`\\${s}`);
  const result = it.substr(at).match(search);
  return result ? [result.index+at, result[0].length] : [-1, 0];
};

export const findIndex = (function(){
  const __find_string = (it,search,at)=>it.indexOf(search,at);
  const __find_regexp = (it,search,at)=>{
    let i = it.substring(at || 0).search(search);
    return (i >= 0) ? (i + (at || 0)) : i;
  };
  return (it,search,at)=>((search instanceof RegExp)?__find_regexp:__find_string)(it,search,at);
}());

//reducer.spec.js
export const findIndexes = (function(){
  return function(c,s,at){
      if(typeof c === "string" || typeof c === "number"){
        var idxs=[], mvc=c+"", s=likeRegexp(s)?s:s+"", at=(!at || !isNumber(at) || at < 0)?0:at, next;
        do {
          let i = findIndex(c,s,at);
          if(i > -1){
            at = (s.length || 1) + i;
            idxs.push(i); 
            next = true;
          } else {
            next = false;
          }
        } while(next)
        return idxs;
      }
    }
}());

//reducer.spec.js
export const cut = function(collection,cutLength=1,emptyDefault=undefined){
  let data = asArray(collection);
  let fill = emptyDefault;
  
  if(data.length > cutLength){
    data.splice(cutLength,Number.POSITIVE_INFINITY);
    return data;
  }
  
  let dataLength = data.length;
  
  if(typeof emptyDefault !== "function"){
    fill = ()=>emptyDefault;
  }
  
  for(let i=0,l=cutLength-dataLength;i<l;i++){
    data.push(fill( dataLength++, i ));
  }
  
  return data;
}

//reducer.spec.js
export const top = function(data,iteratee,topLength){
  switch(typeof iteratee){
  case "function":
    //iteratee=iteratee;
    break;
  case "boolean":
    iteratee=iteratee?(a,b)=>a<b:(a,b)=>a>b;
    break;
  default:
    iteratee=(a,b)=>a<b;
    break;
  }
  
  if(typeof topLength === "boolean"){
    topLength = topLength ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }
  
  return isNumber(topLength) || isInfinity(topLength) ?
  asArray(data).sort((a,b)=>iteratee(a,b)).splice(0,topLength):
  asArray(data).sort((a,b)=>iteratee(a,b))[0];
};

export const get = function(target,path,defaultValue){
  if(typeof target === "object"){
    switch(typeof path){
      case "number": path += "";
      case "string":
        path = castPath(path);
      case "object":
        if(isArray(path)){
          const allget = all(path,(name)=>{
            if(likeObject(target) && (target.hasOwnProperty(name) || target[name])){
              target = target[name];
              return true;
            } else {
              return false;
            }
          });
          return allget ? target : defaultValue;
        } else {
          return;
        }
        break;
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
      return get(obj,key) === value;
    } else {
      for(var key in obj) if(get(obj,key) === value) return true;
    }
  }
  return false;
};

export const turn = function(i, p, ts) {
  if(i < 0) { var abs = Math.abs(i / ts); i = p - (abs > p ? abs % p : abs); }
  ts = ts || 1; i = Math.floor(i / ts);
  return (p > i) ? i : i % p;
};
import {
  isArray
} from './isLike'

import {
  asArray
} from './cast'

export const all = function (data, fn){
  data = asArray(data)
  
  if(data.length === 0){
    return false
  }
  
  for(let i = 0, l = data.length; i < l; i++){
    if(!fn(data[i], i)){
      return false
    } 
  };
  
  return true
}

export const times = function (length, fn){
  const result = []
  for(var i = 0, l = length; i < l; i++){
    result.push(fn(i))
  }
  return result
}

export const hashMap = function (object, fn){
  if(typeof object === "object" && !isArray(object)) for(var k in object) object[k] = fn(object[k], k)
  else return fn(object, (void 0))
  return object
}

export const pairs = (inputArr, fn) => {
  let result = [];
  for(let i=0,l=inputArr.length;i<l;i++){
    for(let ai=0,al=l;ai<al;(i!==ai && result.push([inputArr[i],inputArr[ai]])),ai++);
  }
  return typeof fn === "function" ? result.map(applyArgs=>fn.apply(undefined,applyArgs)) : result;
}
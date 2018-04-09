import { 
  isNumber,
} from './isLike'

import {
  asArray
} from './asTo'

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
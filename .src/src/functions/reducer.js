import { 
  isNumber,
} from './isLike'

import {
  asArray
} from './cast'


import _isObject from 'lodash/isObject';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _get from 'lodash/get';


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

export const hasProperty = function(obj,value,key){
  if(arguments.length == 1 && _isObject(obj)) return _isEmpty(obj);
  if(_isArray(obj)) for(var i=0,l=obj.length;i<l;i++) if(obj[i] === value) return true;
  if(_isObject(obj)){
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
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

export const castString = function(text,defaultOrder,finder,at){
  if(typeof text === "string" || typeof text === "number"){
    let idxs  = []
    let hist  = []
    let count = 0
    let pin   = (!at || !isNumber(at) || at < 0)?0:at
    let strlen= text.length
    let order = defaultOrder
    let next
      
    if(typeof finder !== "function"){ 
      finder = void 0
    }
      
    do {
      let start = void 0;
      let size  = void 0;
        
      if(typeof order === "string"){
        let findedIndex = text.indexOf(order,pin)
        if(findedIndex !== -1){
          start = findedIndex
          size  = order.length
        }
      } else if (order instanceof RegExp) {
        let cs = text.substring(pin || 0);
        let ma = cs.match(order);
        if(ma){
          start = cs.indexOf(ma) + (ma.length - 1)
          size  = ma.length
        } 
      }
        
      count++;
        
      if(typeof start !== "undefined"){
        let string = text.substring(start,start + size);
        let struct = {string,start,size,end:start + size}
          
        //before pin
        if(pin < start){
          let noneCastStruct = {
            string:text.substring(pin,start),
            start:pin,
            size:start-pin,
            end:start
          }
          finder && finder(false,noneCastStruct,hist,count)
        }
          
        //now pin
        pin = start + size;

        //order
        let nextOrder = finder && finder(true,struct,hist,count);
        if(likeRegexp(nextOrder)){
          order = nextOrder
        } else {
          order = defaultOrder
        }
          
        //idx
        idxs.push(start)
        hist.push({string,start,size})
          
        //to be countinue
        if(pin >= strlen){
          next = false
        } else {
          next = true;
        }
      } else {
        let struct = {
          string:text.substring(pin,strlen),
          start:pin,
          size:start-pin,
          end:strlen
        }
        finder && finder(false,struct,hist,count);
        next = false;
      }
        
    } while((count > 1000) ? false : next)
    return idxs;
  }
}

export const castPath = function(pathParam){
  if(isArray(pathParam)){
    return pathParam;
  }
  if(likeString(pathParam)){
    if(isNumber(pathParam)){
      return [pathParam]
    }
    if(typeof pathParam === "string"){
      
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
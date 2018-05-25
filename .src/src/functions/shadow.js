import { 
  isNone,
  isObject,
  isArray,
  likeArray,
  likeObject,
  isPlainObject,
  isEnumerableObject
} from './isLike'

import {
  clone,
  asArray
} from './cast'

export const keys = function(target,filterExp,strict){
  const result = [];
  if(!likeObject(target)) return result;
  
  const filter = typeof filterExp === "function" ? filterExp : ()=>true;
  
  (strict === true ? isArray(target) : likeArray(target)) && 
  Object.keys(target).filter(key=>{ if(isNaN(key)) return; const numberKey = parseInt(key,10); filter(numberKey,target) && result.push( parseInt(numberKey,10) ); }) || 
  (strict === true ? isPlainObject(target) : likeObject(target)) && 
  Object.keys(target).forEach(key=>{ filter(key,target) && result.push(key); });
  
  return result;
};

export const entries = function(it){
  const result = [];
  switch(typeof it){
  case "object":
    isNone(it) ? 0 :
    likeArray(it) ? asArray(it).forEach((v,k)=>{ result.push([k,v]) }) :
    Object.keys(it).forEach(key=>{ result.push([key, it[key]]) });
    break;
  }
  return result;
}

export const deepKeys = (function(){
  
  const nestedDeepKeys = function(target,filter,scope,total){
    if(typeof target === "object"){
      keys(target,(key,target)=>{
        const child  = target[key];
        const useKey = filter(child,key,scope.length);
        if(!useKey){
          return;
        }
        const currentScope = clone(scope);
        currentScope.push(key);
        total.push(currentScope);
        nestedDeepKeys(child,filter,currentScope,total);
      },true);
    }
  };
  
  return function(target,filter){
    const result = [];
    nestedDeepKeys(target,filter ? filter(child,key) : ()=>true,[],result);
    return result;
  }
}());
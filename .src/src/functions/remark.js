import { 
  isNone,
  isNumber,
  likeRegexp,
  likeString,
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

//remark.spec.js
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

//remark.spec.js
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

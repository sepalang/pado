import { 
  isArray,
  isInfinity,
  isNumber,
  isEmpty,
  likeRegexp,
  likeString
} from './isLike'

import {
  asArray
} from './cast'

import {
  get
} from './read'

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
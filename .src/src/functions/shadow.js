import { 
  isNone,
  likeArray,
  likeObject,
  isAbsoluteNaN
} from './isLike'

import { 
  asArray
} from './cast'

export const entries = function(it){
  let result = [];
  switch(typeof it){
  case "object":
    isNone(it) ? 0 :
    likeArray(it) ? asArray(it).forEach((v,k)=>{ result.push([k,v]) }) :
    Object.keys(it).forEach(key=>{ result.push([key, it[key]]) });
    break;
  }
  return result;
}

export const keys = function(target,filterExp){
  let result = [];
  let filter = typeof filterExp === "function" ? filterExp : ()=>true;
  
  likeArray(target) && 
  Object.keys(target).filter(key=>{ !isAbsoluteNaN(key) && filter(key,target) && result.push(parseInt(key,10)); }) || 
  likeObject(target) && 
  Object.keys(target).forEach(key=>{ filter(key,target) && result.push(key); });
  
  return result;
};

export const deepEntries = function(target,filter){
  if(likeArray(target)){
    
  }
  if(likeObject(target)){
    
  }
}
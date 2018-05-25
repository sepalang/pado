import { 
  isInfinity,
  isNumber
} from './isLike'

import {
  asArray
} from './cast'

//reduce.spec.js
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

//reduce.spec.js
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
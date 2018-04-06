import { isArray, isNone, isPlainObject } from './isLike'

export const asArray = function(data, defaultArray = undefined) {
  if(isArray(data)) {
    return data;
  }
  if(isNone(data)) {
    return isArray(defaultArray) ? defaultArray
      : isNone(defaultArray) ? [] : [defaultArray];
  }
  if(typeof data === "object" && typeof data.toArray === "function") {
    return data.toArray();
  }
  return [data];
};

export const toArray = function(data,option){
  if(typeof data === "undefined" || data === null || data === NaN ) return [];
  if(isArray(data)) return Array.prototype.slice.call(data);
  if(typeof data === "object" && typeof data.toArray === "function") return data.toArray();
  if(typeof data === "string", typeof option === "string") return data.split(option);
  return [data];
}

export const asObject = function(data, defaultKey = "value") {
  if(isPlainObject(data)){
    return data;
  } else {
    return { [defaultKey]:data }
  }
};
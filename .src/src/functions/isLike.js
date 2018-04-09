import _isPlainObject from "lodash/isPlainObject"

export const isAbsoluteNaN = function(number){
  return number!==number && typeof number === "number"
}

export const isNone = function(data) {
  return isAbsoluteNaN(data) || data === undefined || data === null
}

export const isNumber = function(){
  return (typeof num === "number" && !isAbsoluteNaN(num))
}

export const isInteger = function(value) {
  //NaN, null, undefined
  if(isNone(value) === true) return false
  
  if(typeof value === "string") {
    value = value.trim()
  }

  if(!(/string|number/.test(typeof value)) || value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY || isNaN(value)) {
    return false
  }

  return value == parseInt(value, 10);
}

export const isArray = function(data) {
  return Array.isArray(data) || data instanceof Array;
}

export const isObject = object=>(object !== null && typeof object === "object") ? true : false

export const isFunction = (f)=>typeof f === "function"

export const likeString = function(data) {
  if(typeof data === "string") return true
  if(isNumber(data)) return true
  return false;
}

export const likeNumber = function(data) {
  if(isNumber(data)) return true
  if(typeof data === "string") return String(parseFloat(t)) === String(t)
  return false;
}

export const likeArray = (function(nodeFn,webFn){
  let definedNodeList
  
  try {
    definedNodeList = (0 instanceof NodeList)
    definedNodeList = true
  } catch(e) {
    definedNodeList = false;
  }
  
  return definedNodeList ? webFn : nodeFn;
}(
  //nodeFn
  function(data){
    return isArray(data)
  },
  //webFn
  function(data){
    return isArray(data) || data instanceof NodeList
  }
))

//TODO : native isPlainObject
export const isNode = (a)=>isObject(a) && typeof a.nodeType === "number"

export const isEmpty = function(){
  if (typeof o === "undefined") return true;
  if (typeof o === "string")return o.trim().length < 1 ? true : false;
  if (typeof o === "object"){
    if(o == null) return true;
    if(o instanceof RegExp) return false;      
    if(isArray(o)) {
      return !o.length;
    } else {
      for (var prop in o) return false; return true;
    }
  }
  if (typeof o === "number")return false;
  if (typeof o === "function")return false;
  if (typeof o === "boolean")return false;
  return true;
}

export const likeRegexp = (s)=> (typeof s === "string") || (s instanceof RegExp)

export const isPlainObject = data => _isPlainObject(data)

export const isExsist = function(value){
  if(value === true){
    return true;
  }
  if(value === false){
    return false;
  }
  if(typeof value === "string" || typeof value === "number"){
    return true;
  } else {
    return false;
  }
}

export const notExsist = value=>!isExsist(value)

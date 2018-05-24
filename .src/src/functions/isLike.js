export const isAbsoluteNaN = function(it){
  return it!==it && typeof it === "number"
}

export const isNone = function(data) {
  return isAbsoluteNaN(data) || data === undefined || data === null
}

export const isNumber = function(it){
  return (typeof it === "number" && !isAbsoluteNaN(it))
}

export const isInfinity = function(it){
  return it === Number.POSITIVE_INFINITY || it === Number.NEGATIVE_INFINITY
}

export const isInteger = function(value) {
  //NaN, null, undefined
  if(isNone(value) === true) return false
  
  if(typeof value === "string") {
    value = value.trim()
  }

  if(!(/string|number/.test(typeof value)) || isInfinity(value) || isNaN(value)) {
    return false
  }

  return value == parseInt(value, 10);
}

export const isArray = function(data) {
  return Array.isArray(data) || data instanceof Array;
}

export const isObject   = it=>(it !== null && typeof it === "object") ? true : false
export const isFunction = (it)=>typeof it === "function"

/*
  * likeObject is have hasOwnProperty
*/
export const likeObject = (it)=>isObject(it) || isFunction(it)

export const likeString = function(data) {
  if(typeof data === "string") return true
  if(isNumber(data)) return true
  return false;
}

export const likeNumber = function(data) {
  if(isNumber(data) || isInfinity(data)) return true
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

export const isEmpty = function(it){
  if (typeof it === "undefined") return true;
  if (typeof it === "string")return it.trim().length < 1 ? true : false;
  if (typeof it === "object"){
    if(it == null) return true;
    if(it instanceof RegExp) return false;      
    if(isArray(it)) {
      return !it.length;
    } else {
      for (var prop in it) return false; return true;
    }
  }
  if (typeof it === "number"){
    //NaN check || false
    return it!==it || false;
  }
  if (typeof it === "function")return false;
  if (typeof it === "boolean")return false;
  return true;
}

export const likeRegexp = (s)=> (typeof s === "string") || (s instanceof RegExp)

export const isPlainObject = data => typeof data === "object" && data.constructor === Object

// none(undfinec, null, NaN), value(1,"1"), hash({}), array([]), node, object(new, Date), function, boolean
export const eqof = function(it){
  const typeIt = typeof it;
  switch(typeIt){
  case "number":
    if(isAbsoluteNaN(it)) return "none";
  case "string":
    return "value";
    break;
  case "object":
    if(isNone(it)) return "none";
    if(likeArray(it)) return "array";
    if(isNode(it)) return "node";
    if(!isPlainObject(it)) return "object";
    return "hash";
    break;
  case "undefined":
    return "none";
    break;
  case "function":
  case "boolean":
  default:
    return typeIt;
    break;
  }
}

export const eqeq = function(value, other){
  if(arguments.length < 2){
    return false;
  }
  
  const rootType = eqof(value);
  
  if(rootType !== eqof(other)){
    return false;
  }
  
  switch(rootType){
  case "none":
    return true;
  default:
    return value == other
  }
}

export const isEqual = function(value, other){
  if (value === other) {
    return true;
  }
  
  if(isAbsoluteNaN(value) && isAbsoluteNaN(other)){
    return true;
  }
  
  
}

// ignore _ $
export const likeEqual = function(){
  
}

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

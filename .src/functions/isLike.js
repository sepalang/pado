export const isAbsoluteNaN = function(it){
  // eslint-disable-next-line no-self-compare
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
  return false
}

export const likeNumber = function(data) {
  if(isNumber(data) || isInfinity(data)) return true
  if(typeof data === "string") return String(parseFloat(data)) === String(data)
  return false
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
    return (typeof data === "object" && data.hasOwnProperty("length")) ? 
    true :
    isArray(data);
  },
  //webFn
  function(data){
    return (typeof data === "object" && data.hasOwnProperty("length")) ?
    true :
    isArray(data) || data instanceof NodeList;
  }
))

export const isPlainObject = data => typeof data === "object" && data.constructor === Object

export const isEnumerableObject = data => isPlainObject(data) || isArray(data)

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

// check JSON, input.value possible value
export const isPresence = function(it){
  return it === undefined || isAbsoluteNaN(it) ? false : true;
}

export const likeRegexp = (s)=> (typeof s === "string") || (s instanceof RegExp)

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

const baseEq = function(value, other, filter, depth=0, strict){
  if(arguments.length < 2) return false;
  
  const valueType = eqof(value);
  const otherType = eqof(other);
  
  if(valueType !== otherType) return false;
  
  switch(valueType){
  case "none":
    return true;
  case "array":
    if(value.length !== other.length){
      return false;
    }
    return value.every((vValue,i)=>{
      const oValue = other[i];
      return (typeof filter === "function" && filter(i,[vValue,oValue],depth) === false) ? true : baseEq(vValue,oValue,filter,depth+1,strict);
    });
    break;
  case "hash":
    const vKeys = Object.keys(value), oKeys = Object.keys(other);
    if(vKeys.length !== oKeys.length || !baseEq(vKeys.sort(),oKeys.sort())) return false;
    return vKeys.every((key)=>{
      const vValue = value[key];
      const oValue = other[key];
      return (typeof filter === "function" && filter(key,[vValue,oValue],depth) === false) ? true : baseEq(vValue,oValue,filter,depth+1,strict);
    });
    break;
  case "node":
  case "object":
  case "function":
  case "boolean":
  case "value":
  default:
    return strict ? value === other : value == other;
  }
}

export const isEqual   = (value, other, filter, depth)=>baseEq(value, other, filter, depth, true);
export const likeEqual = (value, other, filter, depth)=>baseEq(
  value,
  other,
  (key,values,depth)=>/^(\$|\_)/.test(key) ? false : typeof filter === "function" ? filter(key,values,depth) : true, 
  depth, 
  true
);
export const eqeq      = (value, other, filter, depth)=>baseEq(value, other, filter, depth, false);

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

export const likePromise = (target)=>(typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function");
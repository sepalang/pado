import { 
  isObject,
  isArray,
  isFunction,
  isNode,
  isEmpty,
  likeRegexp,
} from './isLike'

import {
  toArray,
  asArray,
  instance
} from './cast'

import {
  get
} from './read';

export const unique = function(array){
  var value = [],result = [], array = toArray(array);
  for(var i=0,l=array.length;i<l;i++){
    var unique = true;
    for(var i2=0,l2=result.length;i2<l2;i2++){
      if(array[i] == result[i2]){
        unique = false; break;
      }
    }
    if(unique==true) result.push(array[i]);
  }
  return result;
}

export const getKeyBy = function(object,value){
  if(isFunction(value)){
    if(isArray(object)) for(var i=0,l=object.length;i<l;i++) if(value(object[i],i)===true) return i;
    if(isObject(object)) for(var key in object) if(value(object[key],key)===true) return key;
  } else {
    if(isArray(object)) for(var i=0,l=object.length;i<l;i++) if(object[i]===value) return i;
    if(isObject(object)) for(var key in object) if(object[key]===value) return key;
  }
}

export const clearOf = function(data,fillFn,sp){
  if(data instanceof Array){
    sp = Array.prototype.splice.call(data,0,data.length);
  } else if(typeof data == "object") {
    sp = {};
    for(var key in data){ sp[key] = data[key]; delete data[key]; } 
  }
  return (fillFn && fillFn(data,sp)), data;
}

export const insertOf = function(data,v,a){
  isArray(data) && data.splice(typeof a === "number"?a:0,0,v)
  return data;
}

export const moveOf = function(data,oldIndex,newIndex){
  if(oldIndex !== newIndex && isArray(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length){
    Array.prototype.splice.call(data,newIndex > data.length ? data.length : newIndex,0,Array.prototype.splice.call(data,oldIndex,1)[0]);
  }
  return data;
}

export const concatOf = function(data,appends){
  var data = asArray(data);
  return asArray(appends).forEach(value=>{ data.push(value); }), data;
}


export const filterOf = function(data,func,exitFn){
  var data    = asArray(data);
  var exitCnt = 0;

  for(var i=0,ri=0,keys=Object.keys(data),l=keys.length;i<l;i++,ri++){
    var key   = keys[i];
    var value = data[key];
    var result = func(value,key);
    if(result == false) {
      var exit = Array.prototype.splice.call(data,i,1);
      i--;
      l--;
      typeof exitFn === "function" && exitFn(value,ri,exitCnt++);
    }
  }
  
  return data;
}

export const sortOf = function(data,filter){
  if(data.length == 0){
    return data;
  }
  
  switch(filter){
  case 'desc':
    filter = function(a,b){ return a>b; }
    break;
  case undefined:
  case 'asc':
  default:
    if(typeof filter !== "function"){
      filter = function(a,b){ return a<b; }
    }
    break;
  }

  var result = [data[0]];

  for(var i=1,l=data.length;i<l;i++){
    for(var ri=0,rl=result.length;ri<rl;ri++){
      if(filter(data[i],result[ri]) === true){
        insertOf(result,data[i],ri);
        break;
      }
      if((ri + 1) === result.length){
        result.push(data[i]);
      }
    }
  }

  clearOf(data);

  for(var i=0,l=result.length;i<l;data.push(result[i]),i++);
  
  return data;
}

export const rebase = function(obj,ref){
  var result = {};
  for(var key in obj){
    if(key === ".*"){
      var refValue = obj[key];
      for(var i=0,d=Object.keys(ref),l=d.length;i<l;i++){
        var refKey = d[i];
        if(typeof refValue === "function"){
          result[refKey] = obj[key];
        } else {
          if((typeof refValue !== "object" && typeof refValue !== "object") || isNode(refValue)){
            result[refKey] = refValue;
          } else {
            result[refKey] = Object.assign(result[refKey],refValue);
          }
        }
      }
    } else if(key.indexOf(",") > -1){
      key.split(",").forEach(deepKey=>{
        deepKey = deepKey.trim();
        if(typeof obj[key] === "function"){
          result[deepKey] = obj[key];
        } else {
          if((!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object") || isNode(obj[key])){
            result[deepKey] = obj[key];
          } else {
            result[deepKey] = Object.assign( result[deepKey] || (isArray(obj[key]) ? [] : {}), obj[key], obj[deepKey] );
          }

        }
      })
    } else {
      if(typeof obj[key] === "function"){
        result[key] = obj[key];
      } else {
        if((typeof result[key] !== "object" && typeof obj[key] !== "object") || isNode(obj[key])){
          result[key] = obj[key]
        } else {
          result[key] = Object.assign(result[key],obj[key]);
        }
      }
    }
  }
  return result;
}



//TODO: Union hasValue
const NESTED_HAS_PROC = function(obj,key){
  var keys = key.split(".");
  if(!keys.length) return false;

  var pointer = obj;
  for(var ki in keys){
    var k = keys[ki];

    if(!pointer.hasOwnProperty(k)){
      return false;
    } else {
      pointer = pointer[k];
    }
  }
  return true;
}

export const apart = function(text,split,block,blockEnd){
  if(typeof text !== "string") return [text];
  
  let result = text.split(split===true?/\s+/:split||/\s+/);
  
  if(likeRegexp(block)){
    if(!likeRegexp(blockEnd)){
      blockEnd = block;
    }
    
    let aparts = []
    let buffer = { dept:0, parts:[] }
    
    for(let d=result,i=0,l=d.length;i<l;i++){
      let part = d[i]
      let greb = {
        start:findIndexes(part,block), 
        end  :findIndexes(part,blockEnd) 
      }
      
      console.log("part, greb", part, greb);
      
      for(let d=greb.start,i=0,l=d.length;i<l;++i){
        let startIndex = d[i]
      }
    }
    
    return aparts;
  } else {
    return result;
  }
}

export const diffStructure = function(before,after){
  var afterKeys = Object.keys(after);
  var beforeKeys;
  var canDiff = false;
  if(isObject(before)){
    if(isArray(before)){
      beforeKeys = before;
    } else {
      beforeKeys = Object.keys(before);
      canDiff    = true;
    }
  } else {
    beforeKeys = [];
  }

  var analysis = {
    after:after,
    before:before,
    keys:unique(afterKeys.concat(beforeKeys)).reduce((dest,key)=>{ dest[key] = undefined;  return dest; },{}),
    match:[],
    missing:[],
    surplus:[],
    diff:[],
    pass:false
  };
  
  //match, missing
  for(var ki in beforeKeys){
    if(!beforeKeys.hasOwnProperty(ki)) continue;
      
    var key = beforeKeys[ki];
      
    if(NESTED_HAS_PROC(after,key)){
      analysis.match.push(key);
      analysis.keys[key] = "match";

      if(canDiff && !angular.equals(get(after,key),get(before,key))) {
        analysis.diff.push(key);
        analysis.keys[key] = "diff";
      }
    } else {
      analysis.surplus.push(key);
      analysis.keys[key] = "surplus";
    }
  }

  //surplus
  asArray(afterKeys).forEach(key=>{
    if(!hasValue(analysis.match,key)){
      analysis.missing.push(key);
      analysis.keys[key] = "missing";
    }
  });

  //absolute
  analysis.pass = !analysis.missing.length && !analysis.surplus.length;

  return analysis;
}

//PINPONGPOOL INTERFACE
export const toggle = function(ta,cv,set){
  var index = -1;
  for(let d=asArray(ta),l=d.length,i=0;i<l;i++){
    if(d[i] == cv) { index = i+1; break; }
  }
  if(arguments.length > 2) for(var i=0,l=ta.length;i<l;i++) if( ta[i] == set ) return ta[i];
  index = ta.length == index ? 0 : index;
  return ta[index];
}
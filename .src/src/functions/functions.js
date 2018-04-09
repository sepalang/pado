import { 
  isNone, 
  isObject,
  isArray,
  isFunction,
  isNumber,
  likeNumber,
  isNode,
  isEmpty,
  likeRegexp,
  isExsist,
  notExsist
} from './isLike'

import {
  toArray,
  asArray,
  instance
} from './transform'

import {
  get
} from './reducer';

const FUNCTION_EXPORTS = {};

const UNIQUE = FUNCTION_EXPORTS.UNIQUE = function(array){
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

const HAS_VALUE = FUNCTION_EXPORTS.HAS_VALUE = (function(){
  var defaultObjectValueFunc = function(object,value){
    return object === value;
  };
    
  var functionKeyObjectValueProc = function(functionKey){
    return function(object,value){
      return Boolean(functionKey(object,value));
    };
  };
    
  var selectKeyObjectValueProc = function(leftSelect,rightSelect){
    var useLeftSelector  = (typeof leftSelect === "string" || typeof leftSelect === "number")
    var useRightSelector = leftSelect === rightSelect ? useLeftSelector : (typeof rightSelect === "string" || typeof rightSelect === "number");
        
    return function(object,value){
      if(useLeftSelector  && !object.hasOwnProperty(leftSelect)) return false;
      if(useRightSelector && !value.hasOwnProperty(rightSelect)) return false;
            
      return (useLeftSelector ? get(object,leftSelect) : object) === (useRightSelector ? get(value,rightSelect) : value);
    };
  };
    
  return function(obj,value,key,getKey){
    if(typeof key === "boolean"){
      if(typeof getKey !== "boolean"){
        getKey = key;
      }
      key = void 0;
    }
        
    if(obj === value){
      return true;
    } else if(isObject(obj)){
      if(value === (void 0) && key === (void 0)) return !isEmpty(obj);
            
      var proc;
            
      if(key){
        if(typeof key === "function") {
          proc = functionKeyObjectValueProc(key);
        } else if(isArray(key) && key.length > 1){
          proc = selectKeyObjectValueProc(key[0],key[1]);
        } else if(typeof key === "string" || typeof key === "number"){
          proc = selectKeyObjectValueProc(key,key);
        }
      } else {
        proc = defaultObjectValueFunc;
      }
            
      if(isArray(obj)){
        for(var i=0,l=obj.length;i<l;i++) if(proc(obj[i],value)) return getKey ? i : true;
      } else {
        for(var objKey in obj) if(obj.hasOwnProperty(objKey) && proc(obj[objKey],value)) return getKey ? objKey : true; 
      }
    }
        
    return getKey ? void 0 : false;
  }
}());

const GET_KEY_BY = FUNCTION_EXPORTS.GET_KEY_BY = function(object,value){
  if(isFunction(value)){
    if(isArray(object)) for(var i=0,l=object.length;i<l;i++) if(value(object[i],i)===true) return i;
    if(isObject(object)) for(var key in object) if(value(object[key],key)===true) return key;
  } else {
    if(isArray(object)) for(var i=0,l=object.length;i<l;i++) if(object[i]===value) return i;
    if(isObject(object)) for(var key in object) if(object[key]===value) return key;
  }
}


const STRING_CAST = FUNCTION_EXPORTS.STRING_CAST = (function(){
  return function(text,defaultOrder,finder,at){
    if(typeof text === "string" || typeof text === "number"){
      let idxs  = []
      let hist  = []
      let count = 0
      let pin   = (!at || !isNumber(at) || at < 0)?0:at
      let strlen= text.length
      let order = defaultOrder
      let next
      
      if(typeof finder !== "function"){ 
        finder = void 0
      }
      
      do {
        let start = void 0;
        let size  = void 0;
        
        if(typeof order === "string"){
          let findedIndex = text.indexOf(order,pin)
          if(findedIndex !== -1){
            start = findedIndex
            size  = order.length
          }
        } else if (order instanceof RegExp) {
          let cs = text.substring(pin || 0);
          let ma = cs.match(order);
          if(ma){
            start = cs.indexOf(ma) + (ma.length - 1)
            size  = ma.length
          } 
        }
        
        count++;
        
        if(typeof start !== "undefined"){
          let string = text.substring(start,start + size);
          let struct = {string,start,size,end:start + size}
          
          //before pin
          if(pin < start){
            let noneCastStruct = {
              string:text.substring(pin,start),
              start:pin,
              size:start-pin,
              end:start
            }
            finder && finder(false,noneCastStruct,hist,count)
          }
          
          //now pin
          pin = start + size;

          //order
          let nextOrder = finder && finder(true,struct,hist,count);
          if(likeRegexp(nextOrder)){
            order = nextOrder
          } else {
            order = defaultOrder
          }
          
          //idx
          idxs.push(start)
          hist.push({string,start,size})
          
          //to be countinue
          if(pin >= strlen){
            next = false
          } else {
            next = true;
          }
        } else {
          let struct = {
              string:text.substring(pin,strlen),
              start:pin,
              size:start-pin,
              end:strlen
          }
          finder && finder(false,struct,hist,count);
          next = false;
        }
        
      } while((count > 1000) ? false : next)
      return idxs;
    }
  }
}())

/*
  bow.findIndexes("hello world","l") [2,3,9]
  bow.findIndexes("hello world",/l/) [2,3,9]
  bow.findIndexes("hello world",/\s/) [5]
*/
const FIND_INDEXES = FUNCTION_EXPORTS.FIND_INDEXES = (function(){
  var __find_string = (c,s,p)=>c.indexOf(s,p)
  var __find_regexp = (c,s,p)=>{
    let i = c.substring(p || 0).search(s);
    return (i >= 0) ? (i + (p || 0)) : i;
  }
  return function(c,s,at){
      if(typeof c === "string" || typeof c === "number"){
        var idxs=[], mvc=c+"", s=likeRegexp(s)?s:s+"", at=(!at || !isNumber(at) || at < 0)?0:at, __find=((s instanceof RegExp)?__find_regexp:__find_string), next;
        do {
          let i = __find(c,s,at);
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

const EACH_PROC = FUNCTION_EXPORTS.EACH_PROC = function(arr,proc){
    if(arr.length > 1){
        for(var i=0,l=arr.length-1;i<l;proc(arr[i],i,false), i++);
        proc(arr[arr.length-1],arr.length-1,true);
    } else if(arr.length == 1) {
        proc(arr[0],0,true);
    }
    return arr;
}

const STATIC_FOR_EACH_PROC = FUNCTION_EXPORTS.STATIC_FOR_EACH_PROC = function(obj,proc){
    if(typeof obj === "object") for(var i=0,a=obj instanceof Array,al=a?obj.length:NaN,keys=Object.keys(obj),l=keys.length;i<l;proc(obj[keys[i]],keys[i],i,l,al),i++);
    return obj;
}

let EACH     = (value,proc)=>EACH_PROC(asArray(value),proc)
let FOR_EACH = (value,proc)=>STATIC_FOR_EACH_PROC(value,proc)
let REDUCE   = function(value,proc,meta){
  value = asArray(value);
  return EACH_PROC(value,function(v,i,l){ meta = proc(meta,v,i,l); }),meta;
}

const CLEAR_OF = FUNCTION_EXPORTS.CLEAR_OF = function(data,fillFn,sp){
  if(data instanceof Array){
    sp = Array.prototype.splice.call(data,0,data.length);
  } else if(typeof data == "object") {
    sp = {};
    for(var key in data){ sp[key] = data[key]; delete data[key]; } 
  }
  return (fillFn && fillFn(data,sp)), data;
}

const INSERT_OF = FUNCTION_EXPORTS.INSERT_OF = function(data,v,a){
  isArray(data) && data.splice(typeof a === "number"?a:0,0,v)
  return data;
}

const MOVE_OF = FUNCTION_EXPORTS.MOVE_OF = function(data,oldIndex,newIndex){
  if(oldIndex !== newIndex && isArray(data) && typeof oldIndex === "number" && typeof newIndex === "number" && oldIndex >= 0 && oldIndex < data.length){
    Array.prototype.splice.call(data,newIndex > data.length ? data.length : newIndex,0,Array.prototype.splice.call(data,oldIndex,1)[0]);
  }
  return data;
}

const CONCAT_OF = FUNCTION_EXPORTS.CONCAT_OF = function(data,appends){
  var data = asArray(data);
  return EACH(appends,function(value){ data.push(value); }), data;
}


const FILTER_OF = FUNCTION_EXPORTS.FILTER_OF = function(data,func,exitFn){
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

const SORT_OF = FUNCTION_EXPORTS.SORT_OF = function(data,filter){
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
        INSERT_OF(result,data[i],ri);
        break;
      }
      if((ri + 1) === result.length){
        result.push(data[i]);
      }
    }
  }

  CLEAR_OF(data);

  for(var i=0,l=result.length;i<l;data.push(result[i]),i++);
  
  return data;
}

const REBASE = FUNCTION_EXPORTS.REBASE = function(obj,ref){
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
      EACH(key.split(","),function(deepKey){
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
      });
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



//TODO: Union HAS_VALUE
const NESTED_HAS_PROC = FUNCTION_EXPORTS.NESTED_HAS_PROC = function(obj,key){
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

const APART = FUNCTION_EXPORTS.APART = function(text,split,block,blockEnd){
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
        start:FIND_INDEXES(part,block), 
        end  :FIND_INDEXES(part,blockEnd) 
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

const DIFF_STRUCTURE = FUNCTION_EXPORTS.DIFF_STRUCTURE = function(before,after){
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
    keys:REDUCE(UNIQUE(afterKeys.concat(beforeKeys)),function(redu,key){ redu[key] = undefined;  return redu; },{}),
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
  EACH(afterKeys,function(key){
    if(!HAS_VALUE(analysis.match,key)){
      analysis.missing.push(key);
      analysis.keys[key] = "missing";
    }
  });

  //absolute
  analysis.pass = !analysis.missing.length && !analysis.surplus.length;

  return analysis;
}

//PINPONGPOOL INTERFACE
const TOGGLE = FUNCTION_EXPORTS.TOGGLE = function(ta,cv,set){
  var index = -1;
  for(let d=asArray(ta),l=d.length,i=0;i<l;i++){
    if(d[i] == cv) { index = i+1; break; }
  }
  if(arguments.length > 2) for(var i=0,l=ta.length;i<l;i++) if( ta[i] == set ) return ta[i];
  index = ta.length == index ? 0 : index;
  return ta[index];
}

const TRUN = FUNCTION_EXPORTS.TRUN = function(i,p,ts){
  if(i < 0) { var abs = Math.abs(i/ts); i = p-(abs>p?abs%p:abs); }; 
  ts=ts?ts:1;i=Math.floor(i/ts);
  return (p > i)?i:i%p;
}

let FINALLY_EXPORTS = Object.keys(FUNCTION_EXPORTS).reduce((dest,key)=>{
  let camelKey = key.toLowerCase().replace(/\_[\w]/g,s=>{
    return s.substr(1).toUpperCase();
  })
  
  dest[camelKey] = FUNCTION_EXPORTS[key]
  
  return dest
},{})

module.exports = { ...FINALLY_EXPORTS }
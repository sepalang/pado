import {
  isArray,
  likeString,
  isNone,
  isAbsoluteNaN,
  isNumber,
  isPlainObject,
  isObject
} from './isLike'

import {
  matchString,
  top
} from './reducer'

import {
  entries
} from './shadow'

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

export const asObject = function(data, defaultKey = "default") {
  if(isPlainObject(data)){
    return data;
  } else {
    return { [defaultKey]:data }
  }
};

export const toNumber = function(v,d){
  switch(typeof v){ case "number":return v;case "string":var r=v.replace(/[^.\d\-]/g,"")*1;return isAbsoluteNaN(r)?0:r;break; }
  switch(typeof d){ case "number":return d;case "string":var r=d*1;return isAbsoluteNaN(r)?0:r;break; }
  return 0;
}

export const cleanObject = function(data){
  if(data instanceof Array){
    Array.prototype.splice.call(data,0,data.length)
  } else if(typeof data == "object") {
    Object.keys(data).forEach(key=>{ delete data[key] })
  }
  return data
}

export const clone = function(target){
  switch(typeof target){
  case "undefined": case "function": case "boolean": case "number": case "string": return target; break;
  case "object":
    if(target === null) return target;
    
    if(isArray(target)){
      let r=[];
      for(let i=0,length=target.length;i<length;i++)r.push(target[i]);
      return r;
    }
    
    if(!isPlainObject(target)){
      if(target instanceof Date){
        let r=new Date();
        r.setTime(target.getTime());
        return r;
      }
      return target;
    }
    
    let r={};
    Object.keys(target).forEach(k=>{
      if(target.hasOwnProperty(k)) r[k]=target[k];
    })
    return r;
    break;
  default : 
    console.error("clone::copy failed : target => ",target);
    return target; 
    break
  }
}

export const cloneDeep = function(target){
  var d;
  if(typeof target === "object"){
  	if(isArray(target)) {
  		if(!isArray(d)) { d = [] };
  		for (var i=0,l=target.length;i<l;i++) d.push( ((typeof target[i] === "object" && target[i] !== null ) ? clone(target[i]) : target[i]) )
  		return d;
  	} else {
  		d = {}
      Object.keys(target).forEach(p=>{
        (typeof target[p] === "object" && target[p] !== null && d[p]) ? clone(target[p],d[p]) : d[p] = target[p];
      })
  		return d;
  	}
  } else {
    clone(target);
  }
};

//cast.castString.spec.js
export const castString = (function(){
  const rebaseMatches = matches=>entries(asArray(matches));
  return function(text,matches,castFn,props){
    const payload = {
      content:text,
      props
    };
  
    const newMatchEntries = rebaseMatches(matches);
  
    const castingState = {
      firstIndex:0,
      lastIndex:text.length,
      castingStart:0,
      cursor:0
    };
    
    if(typeof props === "object" && isNumber(props.start)){
      castingState.castingStart = props.start;
      castingState.cursor       = props.start;
    }

    const open = function({ castingState:{ firstIndex, lastIndex, castingStart, cursor }, matchEntries, castFn, parentScope }){
      
      if(cursor>=lastIndex){
        return false;
      }
      
      //find match
      const matchesMap = matchEntries.map(([matchType, matchExp])=>([matchString(text,matchExp,cursor), matchType, matchExp]));
      let firstMatch   = top(matchesMap,([a,aPriority],[b,bPriority])=>(
        a[0]<0?true:
        b[0]<0?false:
        a[0]==b[0]?aPriority<bPriority:a[0]>b[0]
      ));
      
      // top match is not exsist
      if(!firstMatch){ return false; }
      
      // unmatched
      if(firstMatch[0][0] === -1){
        firstMatch = [[-1, 0], -1, null];
      }

      //next variant
      const [[ matchIndex, matchSize ], matchType, matchExp] = firstMatch;
      const castStart = castingStart;
      const castEnd   = matchType === -1 ? lastIndex : (matchIndex + matchSize);
      const castSize  = castEnd - castStart;
      const skipSize  = castSize - matchSize;
      
      //next params
      const matching = { 
        matchType, 
        matchExp,
        matchIndex,
        matchSize,
        skipSize
      };
      const casting = {
        firstIndex,
        lastIndex,
        castStart,
        castEnd,
        castSize
      };
      const scope = {
        fork (matchEntries,castFn){
          const newMatchEntries = rebaseMatches(matches);
          open({
            castingState:{
              firstIndex  :matching.matchIndex,
              lastIndex   :matching.matchIndex + matchSize,
              castingStart:matching.matchIndex,
              cursor      :matching.matchIndex
            }, 
            matchEntries:newMatchEntries,
            castFn,
            parentScope
          });
        },
        next (needCursor){
          const cursorTo = isNumber(needCursor) ? needCursor : casting.castEnd;
          open({
            castingState:{
              firstIndex  ,
              lastIndex   ,
              castingStart:cursorTo,
              cursor      :cursorTo
            },
            matchEntries,
            castFn,
            parentScope
          });
        },
        enter (enterMatches,enterCastFn){
          open({
            castingState:{
              firstIndex  ,
              lastIndex   ,
              castingStart:matching.matchIndex,
              cursor      :matching.matchIndex
            },
            matchEntries:rebaseMatches(enterMatches),
            castFn:enterCastFn,
            parentScope:{
              next:scope.next
            }
          });
        },
        exit (needCursor){
          parentScope && parentScope.next(isNumber(needCursor) ? needCursor : casting.castEnd);
        },
        more (){
          open({
            castingState:{
              firstIndex  ,
              lastIndex   ,
              castingStart:castStart,
              cursor      :casting.castEnd
            },
            matchEntries,
            castFn,
            parentScope
          });
        }
      };
      
      castFn({
        ...payload,
        ...matching,
        ...casting,
        ...scope
      });
      
      return true;
    };
    
    open({
      castingState,
      matchEntries:newMatchEntries,
      castFn
    });
  
    return payload;
  };
}());

export const castPath = (function(){
  
  const __filterDotPath = (dotPath,removeFirstDot)=>removeFirstDot && dotPath.indexOf(".") === 0 ? dotPath.substr(1) : dotPath;
  const __filterBlockPath = (blockPath)=>{
    //remove []
    blockPath = blockPath.substring(1,blockPath.length-1);
    
    //interger
    if(/^[0-9]+$/.test(blockPath)){
      return parseInt(blockPath,10);
    }
    
    //remove ''
    if(/^\'.*\'$/.test(blockPath) || /^\".*\"$/.test(blockPath)){
      blockPath = blockPath.substring(1,blockPath.length-1);
    }
    return blockPath;
  }

  return function(pathParam){
    if(isArray(pathParam)){
      return pathParam;
    }
  
    if(likeString(pathParam)){
    
      if(isNumber(pathParam)){
        return [pathParam]
      }
    
      if(typeof pathParam === "string"){
        const { props:{ path:result } } = castString(pathParam,[".","["],({
          content, props:{ path }, matchExp, castStart, castEnd, castSize, skipSize, enter, next
        })=>{
          if(matchExp === "."){
            skipSize && path.push( content.substr(castStart, skipSize) )
            next();
          }
          if(matchExp === "["){
            let stackCount = 0;
          
            if(skipSize){
              path.push( __filterDotPath(content.substr(castStart, skipSize),castStart !== 0) );
            }
          
            enter(["[","]"],({ matchExp, castStart, castEnd, more, exit })=>{
              if(matchExp === "[") stackCount++;
              if(matchExp === "]") stackCount--;
              if(matchExp === null) return;
              if(stackCount === 0){
                path.push( __filterBlockPath( content.substring(castStart, castEnd) ) );
                exit();
              } else {
                more();
              }
            });
          }
          if(matchExp === null){
            path.push( __filterDotPath(content.substr(castStart, castEnd),castStart !== 0) );
          }
        },{ path:[] })
      
        return result;
      }
    }
    return [];
  };
}())
  

export const free = function(datum){
  const dest = {}
  Object.keys(datum).forEach(key=>{
    if(!/^\$/.test(key)){
      dest[key] = _cloneDeep(datum[key])
    }
  });
  return dest;
}

const getKeyWithValue = function(obj,value){
  if(isArray(obj)){
    for(var i=0,l=obj.length;i<l;i++) if(obj[i]===value) return i;
  } 
  if(isObject(obj)){
    for(var key in obj) if(obj[key]===value) return key;
  }
  return undefined;
};

export const removeValue = function(obj,value){
  var detect = true;
  var array  = isArray(obj);

  while(detect) {
    var key = getKeyWithValue(obj,value);
    if(typeof key === "undefined"){
      detect = false;
    } else {
      if(array){
        obj.splice(key,1);
      } else {
        delete obj[key];
      }
    }
  }

  return obj;
};

export const instance = function(func,proto){
  var ins,DummyInstance=function(param){ if(typeof param === "object") for(var k in param) this[k] = param[k]; };
  if(typeof func == "object"){
    if(typeof proto === "object") DummyInstance.prototype = proto;
    ins = new DummyInstance(func);
  }
  if(typeof func == "function"){
    if(typeof proto === "object") func.prototype = proto;
    ins = (new func());
  }
  return ins;
}

export const alloc = function(init) {
  let fn = init();
  const rn = function(...args) {
    return fn.apply(this, args);
  };
  rn['reset'] = function() { fn = init(rn, rn); };
  rn['$constructor'] = fn;
  return rn;
};

const syncData = (function(){
  const ENTER_HOOK  = (newDatum)=>_.assign({}, newDatum);
  const UPDATE_HOOK = (oldDatum, newDatum)=>_.assign({}, oldDatum, newDatum);
  
  return function(oldData, newData, getId, options) {
    if(!/string|function/.test(typeof getId)) throw new Error("syncData need getId");
  
    if(typeof getId === "string") {
      const getIdString = getId;
      getId = e=>_.get(e, getIdString);
    }

    oldData = asArray(oldData);
    newData = asArray(newData);

    const result = [];
    const hooks  = asObject(options,"afterEach")
    
    if(typeof hooks["enter"] !== "function"){
      hooks["enter"] = ENTER_HOOK;
    }
    
    if(typeof hooks["update"] !== "function"){
      hooks["update"] = UPDATE_HOOK;
    }
    
    const oldDataMap = _.map(oldData, e=>{
      return { id: getId(e), ref: e };
    });
    
    
    asArray(newData).forEach((newDatum, i)=>{
      const newId = getId(newDatum);
      let oldDatum = _.get(oldDataMap[_.findIndex(oldDataMap, e=>e.id === newId)], "ref");
      let genDatum;
      let dirty = false;

      if(oldDatum) {
        // change is not dirty, modify is dirty
        if(typeof oldDatum !== typeof newDatum) {
          dirty = false;
        } else { // same type
          const oldOwnKeys = Object.keys(oldDatum).filter(key=>!(key.indexOf("$") === 0));
          const newOwnKeys = Object.keys(newDatum).filter(key=>!(key.indexOf("$") === 0));

          // inspect key chnage
          if(_.isEqual(oldOwnKeys, newOwnKeys)) {
            dirty = !_.isEqual(_.pick(oldDatum, oldOwnKeys), _.pick(newDatum, newOwnKeys));
          } else {
            dirty = true;
          }
        }
        
        if(typeof hooks["beforeUpdate"] === "function"){
          if(hooks["beforeUpdate"](oldDatum, newDatum) === false){
            return;
          }
        }
        
        genDatum = hooks["update"](oldDatum, newDatum);
        
        if(typeof hooks["afterUpdate"] === "function"){
          genDatum = hooks["afterUpdate"](genDatum, oldDatum, newDatum);
        }
      } else {
        if(typeof hooks["beforeEnter"] === "function"){
          if(hooks["beforeEnter"](newDatum) === false){
            return;
          }
        }
        
        genDatum = hooks["enter"](newDatum);
        
        if(typeof hooks["afterEnter"] === "function"){
          genDatum = hooks["afterEnter"](genDatum, newDatum);
        }
      }

      if(typeof hooks["afterEach"] === "function") {
        hooks["afterEach"](genDatum, i, dirty);
      }

      result.push(genDatum);
    });

    return result;
  }
}())
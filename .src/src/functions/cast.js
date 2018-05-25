import {
  isArray,
  isNone,
  isAbsoluteNaN,
  isPlainObject,
  isObject
} from './isLike'

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
    });
    return r;
    break;
  default : 
    console.error("clone::copy failed : target => ",target);
    return target; 
    break
  }
}

export const cloneDeep = function(target){
  if(typeof target === "object"){
    let d;
    if(isArray(target)) {
      if(!isArray(d)) { d = [] };
      for (var i=0,l=target.length;i<l;i++) d.push( ((typeof target[i] === "object" && target[i] !== null ) ? clone(target[i]) : target[i]) )
        return d;
    } else {
      d = {}
      Object.keys(target).forEach(p=>{
        (typeof target[p] === "object" && target[p] !== null && d[p]) ? clone(target[p],d[p]) : d[p] = target[p];
      });
      return d;
    }
  } else {
    return clone(target);
  }
};

export const free = function(datum){
  const dest = {}
  Object.keys(datum).forEach(key=>{
    if(!/^\$/.test(key)){
      dest[key] = cloneDeep(datum[key])
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
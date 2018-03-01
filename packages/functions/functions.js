

export const isNullify = function(data){
  if(typeof data === "number") return isNaN(data);
  return data === undefined || data === null;
}

export const isArray = function(data){
  return Array.isArray(data) || data instanceof Array;
}

export const asArray = function(data, defaultArray=undefined){
  if(isArray(data)){
    return data;
  }
  if(isNullify(data)){
    return isArray(defaultArray)   ? defaultArray : 
           isNullify(defaultArray) ? []           : [defaultArray];
  }
  if(typeof data === "object" && typeof data.toArray === "function"){
    return data.toArray();
  }
  return [data];
};

export const isPositiveProp = function(value){
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

export const isNegativeProp = value=>!isPositiveProp(value)

export const refreshData = function(oldData,newData,getId,afterHook){
  if(!/string|function/.test(typeof getId)) throw new Error("refreshData need getId");
  if(typeof getId === "string"){
    let getIdString = getId;
    getId = e=>_.get(e,getIdString);
  }
  
  oldData = asArray(oldData);
  newData = asArray(newData);
  
  let result     = [];
  
  let oldDataMap = _.map(oldData,e=>{
    return {id:getId(e),ref:e};
  })
  
  _.each(newData,(newDatum,i)=>{
    let newId    = getId(newDatum);
    let oldDatum = _.get(oldDataMap[_.findIndex(oldDataMap, e=>e.id===newId)],"ref");
    let genDatum;
    let dirty    = false;
    
    if(oldDatum){
      // change is not dirty, modify is dirty
      if(typeof oldDatum !== typeof newDatum){
        dirty = false;
      } else { // same type
        let oldOwnKeys = Object.keys(oldDatum).filter(key=>!(key.indexOf("$")===0));
        let newOwnKeys = Object.keys(newDatum).filter(key=>!(key.indexOf("$")===0));
        
        //inspect key chnage
        if(_.isEqual(oldOwnKeys,newOwnKeys)){
          dirty = !_.isEqual(_.pick(oldDatum,oldOwnKeys),_.pick(newDatum,newOwnKeys));
        } else {
          dirty = true;
        }
      }
      genDatum = _.assign({},oldDatum,newDatum);
    } else {
      genDatum = _.assign({},newDatum);
    }

    if(typeof afterHook === "function"){
      afterHook(genDatum,i,dirty);
    }

    result.push(genDatum)
  })
  
  return result;
}

export const all = function(data,fn){
  data = asArray(data);
  
  if(data.length === 0){
    return false;
  }
  
  for(let i=0,l=data.length;i<l;i++) if(!fn(data[i],i)){
    return false;
  };
  
  return true;
};
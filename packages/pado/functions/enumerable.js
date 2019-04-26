import {
  isArray,
  isObject
} from './isLike'

import {
  asArray
} from './cast'

export const all = function (data, fn){
  data = asArray(data)
  
  if(data.length === 0){
    return false
  }
  
  for(let i = 0, l = data.length; i < l; i++){
    if(!fn(data[i], i)){
      return false
    } 
  };
  
  return true
}

export const times = function (length, fn){
  const result = []
  for(var i = 0, l = length; i < l; i++){
    result.push(fn(i))
  }
  return result
}

export const hashMap = function (object, fn){
  if(typeof object === "object" && !isArray(object)) for(var k in object) object[k] = fn(object[k], k)
  else return fn(object, (void 0))
  return object
}

export const pairs = (inputArr, fn)=>{
  let result = []
  for(let i = 0, l = inputArr.length; i < l; i++){
    for(let ai = 0, al = l; ai < al; (i !== ai && result.push([inputArr[i], inputArr[ai]])), ai++);
  }
  return typeof fn === "function" ? result.map(applyArgs=>fn.apply(undefined, applyArgs)) : result
}

export const deepForEach = (nsData, key, proc, startParam)=>{
  if (nsData && key && proc) {
    const nestedTreeDownProcess = function(nested, key, proc, parentReturn, depth) {
      ++depth;
      let procIndex = 0;

      asArray(nested, (data, forKey) => {
        if (isArray(data)) {
          data.length && nestedTreeDownProcess(data, key, proc, parentReturn, depth);
        } else {
          if ((isArray(nested) && isObject(data)) || (isObject(data) && forKey == key)) {
            const destChilds = [];

            if (key === Object) {
              asArray(Object.keys(data)).forEach(ok => {
                isArray(data[ok]) && destChilds.push(data[ok]);
              });
            }

            typeof data[key] === "object" && destChilds.push(data[key]);

            const procReturn = proc(data, parentReturn, depth, procIndex++);

            asArray(destChilds, dest => { nestedTreeDownProcess(dest, key, proc, procReturn, depth); });
          }
        }
      })
    };

    if (isObject(nsData) && !isArray(nsData)) {
      const destChilds = [];

      key === Object && Object.keys(nsData).forEach(ok => {
        isArray(nsData[ok]) && destChilds.push(nsData[ok]);
      });
      typeof nsData[key] === "object" && destChilds.push(nsData[key]);

      startParam = proc(nsData, startParam, 0);

      asArray(destChilds).forEach(dest => {
        nestedTreeDownProcess(dest, key, proc, startParam, 0);
      });
    } else {
      nestedTreeDownProcess(nsData, key, proc, startParam, -1);
    }
    return nsData;
  }
};

export const nested = (nsData, key, select, proc)=>{
  let result = [];
  let fineded = false;
  deepForEach(nsData, key, (data, parentReturn, depth, index) => {
    if (fineded) return;
    if (typeof select === "function" ? select(data, parentReturn, depth, index) : data === select) {
      fineded = true;
      return result = parentReturn.concat([data]);
    }
    return parentReturn.concat([data]);
  }, []);

  if (typeof proc === "function") {
    asArray(result).forEach(proc);
  }

  return result;
};

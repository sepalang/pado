import { likeString } from './isLike'
import { asArray } from './cast'
import { get } from './read'

export const zip = (keys, values)=>{
  const asArrayValues = asArray(values)
  return asArray(keys).reduce((dest,key,index)=>{
    dest[key] = asArrayValues[index]
    return dest
  },{})
};

export const zips = (keys, valuesArray)=>asArray(valuesArray).map(values=>zip(keys, values))

//export const unzip = (ziped)=>{
//  if(typeof ziped !== "object" || !ziped) return {};
//  Object.keys(ziped).reduce((dest,zipedKey)=>{
//    dest[0].push(zipedKey)
//    dest[1].push(ziped[zipedKey])
//    return dest
//  }.[[],[]])
//}
//
//export const unzips = ((zipedArray)=>asArray(zipedArray).map(ziped=>unzip(ziped))

export const groupBy = (data,groupKey)=>{
  const result = {}

  asArray(data).forEach((datum,index)=>{
    const setKey = typeof groupKey === "function" ? groupKey(datum, index) : groupKey;
    const setValue = get(datum, setKey);
    result[setKey] ? result[setKey].push(setValue) : (result[setKey]=[setValue])
  });
  
  return result
}

// TODO : merge
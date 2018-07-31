import { 
  isInfinity,
  isNumber
} from './isLike'

import {
  asArray
} from './cast'

import {
  get
} from './read'

import {
  fill
} from './reform'

//reduce.spec.js
export const cut = function (collection, cutLength, emptyDefault, fullResult = false){
  let data = asArray(collection); let rest
  cutLength = isNumber(cutLength) ? cutLength : 1
  
  if(data.length > cutLength){
    rest = data.splice(cutLength, Number.POSITIVE_INFINITY)
    return fullResult === true ? [data, rest] : data
  }
  
  data = fill(data, cutLength, emptyDefault)
  return fullResult === true ? [data, []] : data
}

export const cuts = function (collection, cutLength, emptyDefault){
  const result = []
  let rest = collection
  //
  let rowIndex = 0
  const enumFn = typeof emptyDefault !== "function" ? ()=>emptyDefault : (index)=>emptyDefault(rowIndex * cutLength + index, index, rowIndex)
  
  do {
    ([collection, rest] = cut(rest, cutLength, enumFn, true))
    result.push(collection)
    rowIndex++
  } while(rest.length > 0)
  return result
}

//reduce.spec.js
export const top = function (data, iteratee, topLength){
  switch (typeof iteratee){
    case "function":
    //iteratee=iteratee;
      break
    case "string":
      const path = iteratee
      iteratee = (a, b)=>get(a, path) < get(b, path)
      break
    case "boolean":
      iteratee = iteratee ? (a, b)=>a < b : (a, b)=>a > b
      break
    default:
      iteratee = (a, b)=>a < b
      break
  }
  
  if(typeof topLength === "boolean"){
    topLength = topLength ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
  }
  
  return isNumber(topLength) || isInfinity(topLength)
    ? asArray(data).sort((a, b)=>iteratee(a, b)).splice(0, topLength)
    : asArray(data).sort((a, b)=>iteratee(a, b))[0]
}

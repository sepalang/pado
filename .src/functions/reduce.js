import {
  baseCut
} from './reduce.base'

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


export const cut = function (collection, cutLength, fillContent){
  const useFill = arguments.length > 2
  return baseCut(collection, cutLength, fillContent, useFill)[0]
}

export const cuts = function (collection, cutLength, fillContent){
  const result = []
  let rest = collection
  let rowIndex = 0
  const enumFn = typeof fillContent !== "function" ? ()=>fillContent : (index)=>fillContent(rowIndex * cutLength + index, index, rowIndex)
  const useFill = arguments.length > 2
  
  do {
    ([collection, rest] = baseCut(rest, cutLength, enumFn, useFill))
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

import {
  asArray
} from './cast'

import { 
  isNumber
} from './isLike'

export const fill = function (collection, fillLength, emptyDefault = undefined){
  const data = asArray(collection)
  let dataLength = data.length
  
  fillLength = isNumber(fillLength) ? fillLength : 0
  const fillFn = typeof emptyDefault !== "function" ? ()=>emptyDefault : emptyDefault
  
  for(let i = 0, l = fillLength - dataLength; i < l; data.push(fillFn(dataLength++, i++)));
  
  return collection
}

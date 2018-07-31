import { 
  isNumber
} from '../isLike'

import {
  asArray
} from '../cast'

import {
  fill
} from '../reform'

export const baseCut = function (collection, cutLength, emptyDefault, useFill){
  let data = asArray(collection); let rest
  cutLength = isNumber(cutLength) ? cutLength : 1
  
  if(data.length > cutLength){
    rest = data.splice(cutLength, Number.POSITIVE_INFINITY)
    return [data, rest]
  }
  
  useFill === true && (data = fill(data, cutLength, emptyDefault))
  return [data, []]
}

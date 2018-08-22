import { isAbsoluteNaN } from './isLike'

import { rangeModel } from './matrix'

export const rand64 = (function (){
  var rand64Token = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  return function (length, codeAt, codeLength){
    length = (isAbsoluteNaN(length)) ? 1 : parseInt(length, 10)
    codeAt = (isAbsoluteNaN(codeAt)) ? 0 : parseInt(codeAt, 10)
    codeLength = (isAbsoluteNaN(codeLength)) ? 62 - codeAt : parseInt(codeLength, 10)
    var result = ""
    for(var i = 0, l = length; i < l; i++) result = result + rand64Token.charAt(codeAt + parseInt(Math.random() * codeLength, 10))
    return result
  }
}())


export const tokenize = function (seed, digits){
  return Math.floor((Math.abs(Math.sin(Number((seed + "").replace(/./g, function (s){ return s.charCodeAt(0) }))) * 16777215)) % 16777215).toString(digits || 16) 
}
export const randRange = function (rangeValue, nice){
  const { start, end } = rangeModel(rangeValue)
  const result = start + (Math.random() * (end - start))
  return nice === true ? Math.ceil(result) : result
}

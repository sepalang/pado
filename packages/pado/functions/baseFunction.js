import {
  likeObject,
  likeArray,
  likeString,
  isPlainObject,
  isArray,
  isNone
} from './isLike'

export const baseAsArray = function (data, defaultArray = undefined){
  if(isArray(data)){
    return data
  }
  if(isNone(data)){
    return isArray(defaultArray) ? defaultArray
      : isNone(defaultArray) ? [] : [defaultArray]
  }
  if(typeof data === "object" && typeof data.toArray === "function"){
    return data.toArray()
  }
  return [data]
}

export const stringTest = function (string, rule, meta){
  if(!likeString(string)) return false
  if(typeof rule === "undefined") return true
  return typeof rule === "function" ? Boolean(rule(string, meta))
    : likeString(rule) ? (string + '').indexOf(rule + '') > -1
    : rule instanceof RegExp ? rule.test(string)
    : isArray(rule) ? rule.some(filterKey=>filterKey === string)
    : false
}

//remark.spec.js
export const matchString = (it, search, at = 0)=>{
  if(typeof it !== "string") throw new Error(`matchString :: worng argument ${it}`)
  if(typeof search === "string") search = search.replace(new RegExp("(\\.|\\[|\\])", "g"), s=>`\\${s}`)
  const result = it.substr(at).match(search)
  return result ? [result.index + at, result[0].length] : [-1, 0]
}

export const baseKeys = function (target, filterExp, strict){
  const result = []
  
  if(!likeObject(target)){
    return result
  }
  
  if(strict === true ? isArray(target) : likeArray(target)){
    Object.keys(target).filter(key=>{ 
      if(isNaN(key)) return
      const numberKey = parseInt(key, 10)
      stringTest(numberKey, filterExp, target[key]) && result.push(parseInt(numberKey, 10)) 
    })
  } else if((strict === true ? isPlainObject(target) : likeObject(target))){
    Object.keys(target).forEach(key=>{ 
      stringTest(key, filterExp, target[key]) && result.push(key) 
    })
  }
  
  return result
}

export const baseEntries = function (it){
  const result = []
  switch (typeof it){
    case "object":
      // eslint-disable-next-line no-unused-expressions
      isNone(it) ? 0
        : likeArray(it) ? baseAsArray(it).forEach((v, k)=>{ result.push([k, v]) })
        : Object.keys(it).forEach(key=>{ result.push([key, it[key]]) })
      break
  }
  return result
}

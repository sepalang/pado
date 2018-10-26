import { 
  isNone,
  likeString,
  isNumber,
  likeRegexp,
  isObject,
  isArray,
  likeArray,
  likeObject,
  isPlainObject,
  isEqual
} from './isLike'

import {
  get,
  hasValue
} from './read'

import {
  clone,
  unique,
  asArray
} from './cast'


export const fallback = function (value, fallbackFn, ...args){
  return typeof value === "undefined" ? fallbackFn(...args) : value
}

export const valueOf = function (value, ...args){
  return typeof value === "function" ? value(...args) : value
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

export const keys = function (target, filterExp, strict){
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


export const deepKeys = (function (){
  const nestedDeepKeys = function (target, filter, scope, total){
    if(typeof target === "object"){
      keys(target, (key)=>{
        const child  = target[key]
        const useKey = filter(child, key, scope.length)
        if(!useKey){
          return
        }
        const currentScope = clone(scope)
        currentScope.push(key)
        total.push(currentScope)
        nestedDeepKeys(child, filter, currentScope, total)
      }, true)
    }
  }
  
  return function (target, filter){
    const result = []
    nestedDeepKeys(target, filter ? (child, key)=>{ filter(child, key) } : ()=>true, [], result)
    return result
  }
}())

export const entries = function (it){
  const result = []
  switch (typeof it){
    case "object":
      // eslint-disable-next-line no-unused-expressions
      isNone(it) ? 0
        : likeArray(it) ? asArray(it).forEach((v, k)=>{ result.push([k, v]) })
        : Object.keys(it).forEach(key=>{ result.push([key, it[key]]) })
      break
  }
  return result
}

//remark.spec.js
export const matchString = (it, search, at = 0)=>{
  if(typeof it !== "string") throw new Error(`matchString :: worng argument ${it}`)
  if(typeof search === "string") search = search.replace(new RegExp("(\\.|\\[|\\])", "g"), s=>`\\${s}`)
  const result = it.substr(at).match(search)
  return result ? [result.index + at, result[0].length] : [-1, 0]
}

export const findIndex = (function (){
  const __find_string = (it, search, at)=>it.indexOf(search, at)
  const __find_regexp = (it, search, at)=>{
    let i = it.substring(at || 0).search(search)
    return (i >= 0) ? (i + (at || 0)) : i
  }
  return (it, search, at)=>((search instanceof RegExp) ? __find_regexp : __find_string)(it, search, at)
}())

//remark.spec.js
export const findIndexes = (function (){
  return function (c, s, at){
    if(typeof c === "string" || typeof c === "number"){
      var idxs = []; var s = likeRegexp(s) ? s : s + ""; var at = (!at || !isNumber(at) || at < 0) ? 0 : at; var next
      do {
        let i = findIndex(c, s, at)
        if(i > -1){
          at = (s.length || 1) + i
          idxs.push(i) 
          next = true
        } else {
          next = false
        }
      } while(next)
      return idxs
    }
  }
}())


//TODO: Union hasValue
const NESTED_HAS_PROC = function (obj, key){
  var keys = key.split(".")
  if(!keys.length) return false

  var pointer = obj
  for(var ki in keys){
    var k = keys[ki]

    if(!pointer.hasOwnProperty(k)){
      return false
    } else {
      pointer = pointer[k]
    }
  }
  return true
}

export const diffStructure = function (before, after){
  var afterKeys = Object.keys(after)
  var beforeKeys
  var canDiff = false
  if(isObject(before)){
    if(isArray(before)){
      beforeKeys = before
    } else {
      beforeKeys = Object.keys(before)
      canDiff = true
    }
  } else {
    beforeKeys = []
  }

  var analysis = {
    after  : after,
    before : before,
    keys   : unique(afterKeys.concat(beforeKeys)).reduce((dest, key)=>{ dest[key] = undefined; return dest }, {}),
    match  : [],
    missing: [],
    surplus: [],
    diff   : [],
    pass   : false
  }
  
  //match, missing
  for(var ki in beforeKeys){
    if(!beforeKeys.hasOwnProperty(ki)) continue
      
    var key = beforeKeys[ki]
      
    if(NESTED_HAS_PROC(after, key)){
      analysis.match.push(key)
      analysis.keys[key] = "match"

      if(canDiff && !isEqual(get(after, key), get(before, key))){
        analysis.diff.push(key)
        analysis.keys[key] = "diff"
      }
    } else {
      analysis.surplus.push(key)
      analysis.keys[key] = "surplus"
    }
  }

  //surplus
  asArray(afterKeys).forEach(key=>{
    if(!hasValue(analysis.match, key)){
      analysis.missing.push(key)
      analysis.keys[key] = "missing"
    }
  })

  //absolute
  analysis.pass = !analysis.missing.length && !analysis.surplus.length

  return analysis
}

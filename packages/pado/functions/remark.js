import {
  isNumber,
  likeRegexp,
  isObject,
  isArray,
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

import {
  baseEntries,
  baseKeys
} from './baseFunction'


export const fallback = function (value, fallbackFn, ...args){
  return typeof value === "undefined" ? fallbackFn(...args) : value
}

export const valueOf = function (value, ...args){
  return typeof value === "function" ? value(...args) : value
}

export const keys = baseKeys

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

export const entries = baseEntries

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

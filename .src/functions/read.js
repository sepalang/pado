import {
  isArray,
  likeString,
  isObject,
  likeObject,
  isNumber,
  isEmpty
} from './isLike'

import {
  entries,
  matchString
} from './remark'

import {
  all
} from './enumerable'

import {
  asArray
} from './cast'


//read.readString.spec.js
export const readString = (function (){
  const rebaseMatches = matches=>entries(asArray(matches))
  return function (text, matches, castFn, props){
    const payload = {
      content: text,
      props
    }
  
    const newMatchEntries = rebaseMatches(matches)
  
    const castingState = {
      firstIndex  : 0,
      lastIndex   : text.length,
      castingStart: 0,
      cursor      : 0
    }
    
    if(typeof props === "object" && isNumber(props.start)){
      castingState.castingStart = props.start
      castingState.cursor = props.start
    }

    const open = function ({ castingState:{ firstIndex, lastIndex, castingStart, cursor }, matchEntries, castFn, parentScope }){
      if(cursor >= lastIndex){
        return false
      }
      
      //find match
      const matchesMap = matchEntries.map(([matchType, matchExp])=>([matchString(text, matchExp, cursor), matchType, matchExp]))
      let firstMatch   = asArray(matchesMap).sort(([a, aPriority], [b, bPriority])=>(
        a[0] < 0 ? true
        : b[0] < 0 ? false
        : a[0] == b[0] ? aPriority < bPriority : a[0] > b[0]
      ))[0]
      
      // top match is not exsist
      if(!firstMatch){ return false }
      
      // unmatched
      if(firstMatch[0][0] === -1){
        firstMatch = [[-1, 0], -1, null]
      }

      //next variant
      const [[ matchIndex, matchSize ], matchType, matchExp] = firstMatch
      const castStart = castingStart
      const castEnd   = matchType === -1 ? lastIndex : (matchIndex + matchSize)
      const castSize  = castEnd - castStart
      const skipSize  = castSize - matchSize
      
      //next params
      const matching = { 
        matchType, 
        matchExp,
        matchIndex,
        matchSize,
        skipSize
      }
      const casting = {
        firstIndex,
        lastIndex,
        castStart,
        castEnd,
        castSize
      }
      const scope = {
        fork (matchEntries, castFn){
          const newMatchEntries = rebaseMatches(matches)
          open({
            castingState: {
              firstIndex  : matching.matchIndex,
              lastIndex   : matching.matchIndex + matchSize,
              castingStart: matching.matchIndex,
              cursor      : matching.matchIndex
            }, 
            matchEntries: newMatchEntries,
            castFn,
            parentScope
          })
        },
        next (needCursor){
          const cursorTo = isNumber(needCursor) ? needCursor : casting.castEnd
          open({
            castingState: {
              firstIndex,
              lastIndex,
              castingStart: cursorTo,
              cursor      : cursorTo
            },
            matchEntries,
            castFn,
            parentScope
          })
        },
        enter (enterMatches, enterCastFn){
          open({
            castingState: {
              firstIndex,
              lastIndex,
              castingStart: matching.matchIndex,
              cursor      : matching.matchIndex
            },
            matchEntries: rebaseMatches(enterMatches),
            castFn      : enterCastFn,
            parentScope : {
              next: scope.next
            }
          })
        },
        exit (needCursor){
          parentScope && parentScope.next(isNumber(needCursor) ? needCursor : casting.castEnd)
        },
        more (){
          open({
            castingState: {
              firstIndex,
              lastIndex,
              castingStart: castStart,
              cursor      : casting.castEnd
            },
            matchEntries,
            castFn,
            parentScope
          })
        }
      }
      
      castFn({
        ...payload,
        ...matching,
        ...casting,
        ...scope
      })
      
      return true
    }
    
    open({
      castingState,
      matchEntries: newMatchEntries,
      castFn
    })
  
    return payload
  }
}())

export const readPath = (function (){
  const __filterDotPath = (dotPath, removeFirstDot)=>removeFirstDot && dotPath.indexOf(".") === 0 ? dotPath.substr(1) : dotPath
  const __filterBlockPath = (blockPath)=>{
    //remove []
    blockPath = blockPath.substring(1, blockPath.length - 1)
    
    //interger
    if(/^[0-9]+$/.test(blockPath)){
      return parseInt(blockPath, 10)
    }
    
    //remove ''
    if(/^\'.*\'$/.test(blockPath) || /^\".*\"$/.test(blockPath)){
      blockPath = blockPath.substring(1, blockPath.length - 1)
    }
    return blockPath
  }

  return function (pathParam){
    if(isArray(pathParam)){
      return pathParam
    }
  
    if(likeString(pathParam)){
      if(isNumber(pathParam)){
        return [pathParam]
      }
    
      if(typeof pathParam === "string"){
        //one depth
        if(!/\.|\[/.test(pathParam)){
          return [pathParam]
        }
        
        //multiple depth
        const { props:{ path:result } } = readString(pathParam, [".", "["], ({
          content, props:{ path }, matchExp, castStart, castEnd, skipSize, enter, next
        })=>{
          if(matchExp === "."){
            skipSize && path.push(content.substr(castStart, skipSize))
            next()
          }
          if(matchExp === "["){
            let stackCount = 0
          
            if(skipSize){
              path.push(__filterDotPath(content.substr(castStart, skipSize), castStart !== 0))
            }
          
            enter(["[", "]"], ({ matchExp, castStart, castEnd, more, exit })=>{
              if(matchExp === "[") stackCount++
              if(matchExp === "]") stackCount--
              if(matchExp === null) return
              if(stackCount === 0){
                path.push(__filterBlockPath(content.substring(castStart, castEnd)))
                exit()
              } else {
                more()
              }
            })
          }
          if(matchExp === null){
            path.push(__filterDotPath(content.substr(castStart, castEnd), castStart !== 0))
          }
        }, { path: [] })
      
        return result
      }
    }
    return []
  }
}())

export const get = function (target, path, defaultValue){
  if(typeof target === "object"){
    switch (typeof path){
      case "number": path += ""
      case "string":
        path = readPath(path)
      case "object":
        if(isArray(path)){
          const allget = all(path, (name)=>{
            if(likeObject(target) && (target.hasOwnProperty(name) || target[name])){
              target = target[name]
              return true
            } else {
              return false
            }
          })
          return allget ? target : defaultValue
        } else {
          return
        }
        break
      case "function": return path.call(this, target)
    }
  } else if(typeof target === "function"){
    return target.apply(this, Array.prototype.slice.call(arguments, 1))
  }
  return target
}

export const hasProperty = function (target, pathParam){
  return all(readPath(pathParam), path=>{
    if(likeObject(target) && likeString(path) && target.hasOwnProperty(path)){
      target = target[path]
      return true
    }
    return false
  })
}

export const hasValue = (function (){
  const defaultObjectValueFunc = function (object, value){
    return object === value
  }
    
  const functionKeyObjectValueProc = function (functionKey){
    return function (object, value){
      return Boolean(functionKey(object, value))
    }
  }
    
  const selectKeyObjectValueProc = function (leftSelect, rightSelect){
    var useLeftSelector  = (typeof leftSelect === "string" || typeof leftSelect === "number")
    var useRightSelector = leftSelect === rightSelect ? useLeftSelector : (typeof rightSelect === "string" || typeof rightSelect === "number")
        
    return function (object, value){
      if(useLeftSelector && !object.hasOwnProperty(leftSelect)) return false
      if(useRightSelector && !value.hasOwnProperty(rightSelect)) return false
            
      return (useLeftSelector ? get(object, leftSelect) : object) === (useRightSelector ? get(value, rightSelect) : value)
    }
  }
    
  return function (obj, value, key, getKey){
    if(typeof key === "boolean"){
      if(typeof getKey !== "boolean"){
        getKey = key
      }
      key = void 0
    }
        
    if(obj === value){
      return true
    } else if(likeObject(obj)){
      if(value === (void 0) && key === (void 0)) return !isEmpty(obj)
            
      var proc
            
      if(key){
        if(typeof key === "function"){
          proc = functionKeyObjectValueProc(key)
        } else if(isArray(key) && key.length > 1){
          proc = selectKeyObjectValueProc(key[0], key[1])
        } else if(typeof key === "string" || typeof key === "number"){
          proc = selectKeyObjectValueProc(key, key)
        }
      } else {
        proc = defaultObjectValueFunc
      }
            
      if(isArray(obj)){
        for(var i = 0, l = obj.length; i < l; i++) if(proc(obj[i], value)) return getKey ? i : true
      } else {
        for(var objKey in obj) if(obj.hasOwnProperty(objKey) && proc(obj[objKey], value)) return getKey ? objKey : true 
      }
    }
        
    return getKey ? void 0 : false
  }
}())

export const readDatum = function (rootValue, readFn, rootParam){
  const enterScope = (value, depth, param)=>isObject(value) ? objectScope(value, depth, param) : isArray(value) ? arrayScope(value, depth, param) : primitiveScope(value, depth, param)
  
  const arrayScope = (array, depth, param)=>{
    return readFn({
      type : "array",
      value: array,
      key  : null,
      depth,
      param,
      enter: (param)=>{
        const childrenDepth = depth + 1
        return Array(array.length).fill(void 0).map((v, i)=>i).map(key=>{
          const value = array[key]
          return enterScope(value, childrenDepth, param)
        })
      }
    })
  }
  
  const objectScope = (object, depth, param)=>{
    return readFn({
      type : "object",
      value: object,
      key  : null,
      depth,
      param,
      enter: (param)=>{
        const childrenDepth = depth + 1
        return Object.keys(object).map(key=>{
          const value = object[key]
          return readFn({
            type : "hash",
            key,
            value,
            depth,
            param,
            enter: (param)=>enterScope(value, childrenDepth, param)
          })
        })
      }
    })
  }
  
  const primitiveScope = (value, depth, param)=>{
    readFn({
      type : "value",
      key  : null,
      value,
      depth,
      param,
      enter: (param)=>param
    })
  }
  
  enterScope(rootValue, 0, rootParam)
  return rootParam
}

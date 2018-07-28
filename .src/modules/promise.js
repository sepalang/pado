import { asArray, asObject, isNumber, likePromise, turn, argumentNamesBy } from '../functions'
import { operate } from './operate'

const PromiseClass = Promise

const resolveFn = PromiseClass.resolve
const rejectFn = PromiseClass.reject

export const newPromise = (fn)=>(new PromiseClass((r, c)=>{
  const maybeAwaiter = fn(r, c)
  likePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c)
}))

export const promise = (fn)=>newPromise(fn)
const PromiseFunction = promise

export const all     = Promise.all
PromiseFunction.all = all

export const resolve    = resolveFn
PromiseFunction.resolve = resolve

export const reject    = rejectFn
PromiseFunction.reject = reject

export const timeout = function (fn, time){
  if(typeof fn === "number"){
    return newPromise(resolve=>setTimeout(()=>resolve(time), fn))
  } else {
    return newPromise(resolve=>setTimeout(()=>resolve(typeof fn === "function" ? fn() : fn), time))
  }
}
PromiseFunction.timeout = timeout

export const valueOf = function (maybeQ){
  return newPromise(function (resolve, reject){
    likePromise(maybeQ)
      ? maybeQ.then(resolve).catch(reject)
      : resolve(maybeQ) 
  })
}
PromiseFunction.valueOf = valueOf

const abortMessage = new function (){
  Object.defineProperty(this, "message", {
    get: ()=>":abort"
  })
  Object.defineProperty(this, "abort", {
    get: ()=>true
  })
}()

export const abort = function (notifyConsole = undefined){
  return new PromiseClass((resolve, reject)=>{
    if(notifyConsole === true){
      console.warn("abort promise")
    }
    reject(abortMessage)
  })
}
PromiseFunction.abort = abort

export const defer = function (){
  var resolve, reject
  var promise = new PromiseClass(function (){
    resolve = arguments[0]
    reject = arguments[1]
  })
  return {
    resolve: resolve,
    reject : reject,
    promise: promise
  }
}
PromiseFunction.defer = defer

export const promisify = function (asyncErrCallbackfn){
  const argumentNames = argumentNamesBy(asyncErrCallbackfn).slice(1)
  const promisified   = function (){
    const args = Array.from(arguments)
    return new Promise((resolve, reject)=>{
      const applyParams = args.concat(function(){
        const [error, ...callbakArgs] = Array.from(arguments)
        if(error){
          reject(error)
        } else if(argumentNames.length && callbakArgs.length > 1){
          resolve(argumentNames.reduce((dest, name, index)=>{
            dest[name] = callbakArgs[index]
            return dest
          }, {}))
        } else {
          resolve(callbakArgs[0])
        }
      })
      asyncErrCallbackfn.apply(this, applyParams)
    })
  }
  return function (){
    return promisified.apply(this, Array.from(arguments))
  }
}

export const until = function (tasks, option){
  if(!(tasks instanceof Array)){
    return PromiseFunction.reject(new Error("tasks must be array"))
  }

  if(!tasks.length || !tasks.some(e=>typeof e === "function")){
    return PromiseFunction.reject(new Error("not found wheel executable"))
  }

  if(!tasks.some(e=>(typeof e !== "function" || typeof e !== "number"))){
    return PromiseFunction.reject(new Error("wheel task only function or number executable"))
  }

  if(typeof option !== "object"){
    option = {}
  }

  let finished = false
  let defer
  const limit = (typeof option.limit === "number" && option.limit > 0) ? parseInt(option.limit, 10) : 10000
  const taskLength = tasks.length
  let wheelTick = 0
  let resetScope = 0
  const nextWheelTick = (tick, value, tickScope)=>{
    const nowAction = tasks[turn(tick, taskLength, 1)]

    const isActiveFn = ()=>{
      return tickScope === resetScope
    }

    const nextTickFn = passValue=>{
      // if reset called
      if(!isActiveFn()) return
      // if over tick
      if(wheelTick > limit){
        return defer.reject(new Error("limit"))
      }
      if(finished === false){
        nextWheelTick(wheelTick++, passValue, tickScope)
      }
    }

    if(typeof nowAction === "function"){
      nowAction(
        {
          value,
          next    : nextTickFn,
          isActive: isActiveFn,
          resolve : defer.resolve,
          reject  : defer.reject
        },
        Math.floor(tick / tasks.length),
        tick
      )
    } else if(typeof nowAction === "number"){
      setTimeout(()=>{ nextTickFn(value) }, nowAction)
    }
  }
  
  const thenStack  = [
    e=>{
      if(finished === null) return PromiseFunction.abort()
      finished = true
      return e
    }
  ]
  const catchStack = [
    e=>{
      if(finished === null) return PromiseFunction.abort()
      finished = true
      return PromiseFunction.reject(e)
    }
  ]
  
  const deferReset = (resetTick)=>{
    defer && defer.stop()
    //
    defer = PromiseFunction.defer()
    thenStack.forEach(fn=>defer.promise.then(fn))
    catchStack.forEach(fn=>defer.promise.catch(fn))
    
    //
    defer.stop = ()=>{
      finished = null
      resetScope += 1
    }
    
    defer.start = (resetTick)=>{
      if(finished === null){
        finished = false
        wheelTick = typeof resetTick === "number" ? resetTick : 0
        nextWheelTick(wheelTick++, option.value, resetScope)
      }
    }
    //
    defer.reset = deferReset
    //
    finished = null
    defer.start(resetTick)
  }
  
  deferReset(0)
  
  const wheelControls = {
    ...defer,
    then (fn){
      defer.promise.then(fn)
      thenStack.push(fn)
      return wheelControls
    },
    catch (fn){
      defer.promise.catch(fn)
      catchStack.push(fn)
      return wheelControls
    }
  }
  
  return wheelControls
}

export const batch = function (funcArray, opts){
  return newPromise(function (resolve, reject){
    const option = asObject(opts, "concurrent")
      
    if(option.concurrent === true){
      option.concurrent = Number.POSITIVE_INFINITY
    } else if(!isNumber(option.concurrent) || option.concurrent < 1){
      option.concurrent = 1
    }
      
    if(!isNumber(option.interval) || option.interval < -1){
      option.interval = -1
    }
      
    if(!isNumber(option.repeat) || option.repeat < 1){
      option.repeat = 1
    }
      
    //set task with repeat
    const sequanceTaskEntries = Array(option.repeat)
    .fill(asArray(funcArray))
    .reduce((dest, tasks)=>{
      tasks.forEach((fn, index)=>dest.push([index, fn]))
      return dest
    }, [])
      
    const sequanceLength = sequanceTaskEntries.length
    let sequanceComplete = 0
    const sequanceReseult = Array(sequanceTaskEntries.length)
      
    operate({
      output: async ({ entry })=>{
        if(option.interval > -1){
          await PromiseFunction.timeout(option.interval)
        }
        return entry
      },
      limitOutput: 1
    })
    .operate({
      concurrent: option.concurrent,
      input     : async ({ entry })=>{
        // eslint-disable-next-line no-unused-vars
        const [index, fn] = entry
        entry.push(await fn())
        return entry
      },
      output: ({ entry })=>{
        // eslint-disable-next-line no-unused-vars
        const [index, fn, result] = entry
        
        sequanceReseult[index] = result
        sequanceComplete++
        
        if(sequanceComplete === sequanceLength){
          resolve(sequanceReseult)
        }
      }
    })
    .concat(sequanceTaskEntries)
  })
}

import { promise as PromiseFunction, newPromise, PromiseClass } from './promiseEngine'
import { likePromise } from '../../functions'

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

export const promise = PromiseFunction

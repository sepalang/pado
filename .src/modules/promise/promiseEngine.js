import { likePromise } from '../../functions'
export const PromiseClass = Promise

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

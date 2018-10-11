import { promise } from './promise'

const SESSION_STORE = {}
const STATE_STORE   = {}

/*
let idx = 0;
session("scopeName").open((name)=>{ id:idx++, name });

let { item, resolve } = await session("scopeName").spawn("bob");
resolve(item);

let { item, resolve } = await session("scopeName").spawn("cat");
resolve(item);

session("scopeName").close()
*/

export const session = function (name){
  const inst = {
    outputs: ()=>STATE_STORE[name].map(e=>e.output),
    open   : (fn)=>{
      SESSION_STORE[name] = fn
      STATE_STORE[name] = []
    },
    close: ()=>{
      const result = inst.outputs()
      delete SESSION_STORE[name]
      delete STATE_STORE[name]
      return Promise.all(result)
    },
    spawn: (payload)=>{
      if(typeof SESSION_STORE[name] !== "function"){
        if(!SESSION_STORE[name]){
          throw new Error(`session:: ${name} is not defined`)
        } else {
          throw new Error(`session:: ${name} is not function callback`)
        }
      }
      
      const input = promise.valueOf(SESSION_STORE[name](payload))
      const managedSpawn = {
        input,
        output: undefined,
        item  : undefined
      }
      
      return input.then((item)=>{
        const deferred      = promise.defer()
        const deferPromise  = deferred.promise
        managedSpawn.output = deferPromise
        managedSpawn.item = item
        
        STATE_STORE[name].push(managedSpawn)
        
        return { 
          item,
          resolve: deferred.resolve,
          reject : deferred.reject
        }
      })
    }
  }
  
  return inst
}

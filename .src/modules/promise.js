import { asArray, asObject, isNumber, turn } from '../functions';
import { operate } from './operate';

const PromiseClass = Promise;

const isMaybePromise = (target)=>(typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function");
const resolveFn = PromiseClass.resolve;
const rejectFn = PromiseClass.reject;

const PromiseFunction = function(fn) { 
  return new PromiseClass((r,c)=>{
    const maybeAwaiter = fn(r,c);
    isMaybePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
  });
};

export const promise = PromiseFunction;
export const all     = PromiseFunction.all = Promise.all;
export const resolve = PromiseFunction.resolve = resolveFn;
export const reject  = PromiseFunction.reject = rejectFn;
export const timeout = PromiseFunction.timeout = function(fn,time){
  if(typeof fn === "number"){
    return PromiseFunction( resolve => setTimeout(() => resolve(time), fn) );
  } else {
    return PromiseFunction( resolve => setTimeout(() => resolve(typeof fn === "function" ? fn() : fn),time) );
  }
};

export const valueOf = PromiseFunction.valueOf = function(maybeQ){
  return PromiseFunction(function(resolve,reject){
    isMaybePromise(maybeQ) ?
    maybeQ.then(resolve).catch(reject) :
    resolve(maybeQ) ;
  });
};

const abortMessage = new (function() {
  Object.defineProperty(this, "message", {
    get: ()=>":abort"
  });
  Object.defineProperty(this, "abort", {
    get: ()=>true
  });
})();

export const abort = PromiseFunction.abort = function(notifyConsole = undefined) {
  return new PromiseClass((resolve, reject)=>{
    if(notifyConsole === true) {
      console.warn("abort promise");
    }
    reject(abortMessage);
  });
};

export const defer = PromiseFunction.defer = function(){
  var resolve, reject;
  var promise = new PromiseClass(function() {
    resolve = arguments[0];
    reject = arguments[1];
  });
  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  };
};

export const wheel = PromiseFunction.wheel = function(tasks, option) {

  if(!(tasks instanceof Array)) {
    return PromiseFunction.reject(new Error("tasks must be array"));
  }

  if(!tasks.length || !tasks.some(e=>typeof e === "function")) {
    return PromiseFunction.reject(new Error("not found wheel executable"));
  }

  if(!tasks.some(e=>(typeof e !== "function" || typeof e !== "number"))) {
    return PromiseFunction.reject(new Error("wheel task only function or number executable"));
  }

  if(typeof option !== "object") {
    option = {};
  }

  let finished = false;
  let defer;
  const limit = (typeof option.limit === "number" && option.limit > 0) ? parseInt(option.limit, 10) : 10000;
  const taskLength = tasks.length;
  let wheelTick = 0;
  let resetScope = 0;
  const nextWheelTick = (tick, value, tickScope)=>{
    const nowAction = tasks[turn(tick, taskLength, 1)];

    const isActiveFn = ()=>{
      return tickScope === resetScope;
    };

    const nextTickFn = passValue=>{
      // if reset called
      if(!isActiveFn()) return;
      // if over tick
      if(wheelTick > limit) {
        return defer.reject(new Error("limit"));
      }
      if(finished === false) {
        nextWheelTick(wheelTick++, passValue, tickScope);
      }
    };

    if(typeof nowAction === "function") {
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
      );
    } else if(typeof nowAction === "number") {
      setTimeout(()=>{ nextTickFn(value); }, nowAction);
    }
  };
  
  const thenStack  = [
    e=>{
      if(finished === null) return PromiseFunction.abort();
      finished = true;
      return e;
    }
  ];
  const catchStack = [
    e=>{
      if(finished === null) return PromiseFunction.abort();
      finished = true;
      return PromiseFunction.reject(e);
    }
  ];
  
  const deferReset = (resetTick)=>{
    defer && defer.stop();
    //
    defer = PromiseFunction.defer();
    thenStack.forEach(fn=>defer.promise.then(fn));
    catchStack.forEach(fn=>defer.promise.catch(fn));
    
    //
    defer.stop = (resetTick)=>{
      finished = null;
      resetScope += 1;
    };
    
    defer.start = (resetTick)=>{
      if(finished === null) {
        finished = false;
        wheelTick = typeof resetTick === "number" ? resetTick : 0;
        nextWheelTick(wheelTick++, option.value, resetScope);
      }
    };
    //
    defer.reset = deferReset;
    //
    finished = null;
    defer.start(resetTick);
  };
  
  deferReset(0);
  
  const wheelControls = {
    ...defer,
    then (fn){
      defer.promise.then(fn);
      thenStack.push(fn);
      return wheelControls;
    },
    catch (fn){
      defer.promise.catch(fn);
      catchStack.push(fn);
      return wheelControls;
    }
  };
  
  return wheelControls;
}

export const sequance = PromiseFunction.sequance = function(funcArray, opts){
  return PromiseFunction(function(resolve, reject){
    const option = asObject(opts,"concurrent");
      
    if(option.concurrent === true){
      option.concurrent = Number.POSITIVE_INFINITY;
    } else if(!isNumber(option.concurrent) || option.concurrent < 1){
      option.concurrent = 1;
    }
      
    if(!isNumber(option.interval) || option.interval < -1){
      option.interval = -1;
    }
      
    if(!isNumber(option.repeat) || option.repeat < 1){
      option.repeat = 1;
    }
      
    //set task with repeat
    const sequanceTaskEntries = Array(option.repeat)
    .fill(asArray(funcArray))
    .reduce((dest,tasks)=>{
      tasks.forEach((fn,index)=>dest.push([index,fn]));
      return dest;
    },[]);
      
    const sequanceLength = sequanceTaskEntries.length;
    let sequanceComplete = 0;
    const sequanceReseult = Array(sequanceTaskEntries.length);
      
    const sequanceOperator = operate({
      output:async ({ entry })=>{
        if(option.interval > -1){
          await PromiseFunction.timeout(option.interval);
        }
        return entry;
      },
      limitOutput:1
    })
    .operate({
      concurrent:option.concurrent,
      input:async ({ entry })=>{
        const [index, fn] = entry;
        entry.push(await fn());
        return entry;
      },
      output:({ entry })=>{
        const [index, fn, result] = entry;
        sequanceReseult[index] = result;
        sequanceComplete++;
        if(sequanceComplete === sequanceLength){
          resolve(sequanceReseult);
        }
      }
    })
    .concat(sequanceTaskEntries);
  });
};
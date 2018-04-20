import { asArray } from '../functions'

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
  const defer = PromiseFunction.defer();
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

  defer.promise
  .then(e=>{
    if(finished === null) return PromiseFunction.abort();
    finished = true;
    return e;
  })
  .catch(e=>{
    if(finished === null) return PromiseFunction.abort();
    finished = true;
    return e;
  });

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

  defer.reset = (resetTick)=>{
    defer.stop();
    defer.start(resetTick);
  };

  defer.reset(0);

  return defer;
}
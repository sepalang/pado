import { asArray } from '../functions'

const isMaybePromise = (target)=>(typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function");
const resolveFn = PromiseClass.resolve;
const rejectFn = PromiseClass.reject;
const PromiseFunction = (function(PromiseClass){
  return new PromiseClass((r,c)=>{
    const maybeAwaiter = fn(r,c);
    isMaybePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
  });
}(Promise));

const PromiseExports = {};

PromiseExports.all     = Promise.all;
PromiseExports.resolve = resolveFn;
PromiseExports.reject  = rejectFn;
PromiseExports.timeout = function(fn,time){
  if(typeof fn === "number"){
    return q( resolve => setTimeout(() => resolve(time), fn) );
  } else {
    return q( resolve => setTimeout(() => resolve(typeof fn === "function" ? fn() : fn),time) );
  }
};

PromiseExports.valueOf = function(maybeQ){
  return q(function(resolve,reject){
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

PromiseExports.abort = function(notifyConsole = undefined) {
  return new PromiseClass((resolve, reject)=>{
    if(notifyConsole === true) {
      console.warn("abort promise");
    }
    reject(abortMessage);
  });
};

PromiseExports.defer = function(){
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

PromiseExports.wheel = function(tasks, option) {

  if(!(tasks instanceof Array)) {
    return q.reject(new Error("tasks must be array"));
  }

  if(!tasks.length || !tasks.some(e=>typeof e === "function")) {
    return q.reject(new Error("not found wheel executable"));
  }

  if(!tasks.some(e=>(typeof e !== "function" || typeof e !== "number"))) {
    return q.reject(new Error("wheel task only function or number executable"));
  }

  if(typeof option !== "object") {
    option = {};
  }

  let finished = false;
  const defer = q.defer();
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
    if(finished === null) return q.abort();
    finished = true;
    return e;
  })
  .catch(e=>{
    if(finished === null) return q.abort();
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

Object.keys(PromiseExports).forEach(key=>{
  PromiseFunction[key] = PromiseExports[key];
})


module.exports = PromiseExports;
export const promise = PromiseFunction;
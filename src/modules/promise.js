import { asArray } from '../functions'

export default (function(PromiseClass){
  let q = function(fn){return new PromiseClass(fn);}
  
  q.all     = Promise.all;
  q.resolve = Promise.resolve;
  q.reject  = Promise.reject;
  
  q.timeout = function(fn,time){
    if(typeof fn === "number"){
      //fn => time, time => result
      return q( resolve => setTimeout(() => resolve(time), fn) );
    } else {
      return q( resolve => setTimeout(() => resolve(typeof fn === "function" ? fn() : fn),time) );
    }
  };
  
  q.valueOf = function(maybeQ){
    return q(function(resolve,reject){
      typeof maybeQ === "object" && maybeQ !== null && maybeQ.then ?
      maybeQ.then(resolve).catch(reject) :
      resolve(maybeQ) ;
    });
  };
  
  q.break = function(notifyConsole){
    return new PromiseClass(e=>{
      if(notifyConsole === true){
        console.warn("break promise",e);
      }
    });
  };
  
  q.timeoutTest = function(time){
    return (value)=>promise(resolve=>{setTimeout(e=>resolve(value),time)})
  }
  
  q.defer = function(){
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
  
  q.wheel = function(tasks,option){
    
    if(!(tasks instanceof Array)){
      return q.reject(new Error("tasks must be array"));
    }
    
    if(!tasks.length || !tasks.some(e=>typeof e === "function")){
      return q.reject(new Error("not found wheel executable"));
    }
    
    if(!tasks.some(e=>(typeof e !== "function" || typeof e !== "number"))){
      return q.reject(new Error("wheel task only function or number executable"));
    }
    
    if(typeof option !== "object"){
      option = {};
    }
    
    let finished   = false;
    let defer      = q.defer();
    let limit      = (typeof option.limit === "number" && option.limit > 0) ? parseInt(option.limit) : 10000;
    let taskLength = tasks.length;
    let wheelTick  = 0;
    let resetScope = 0;
    
    defer.promise
    .then(e=>{
      if(finished === null) return q.break();
      finished = true;
      return e;
    })
    .catch(e=>{
      if(finished === null) return q.break();
      finished = true;
      return e;
    });
    
    defer.stop = ()=>{
      finished = null;
    }
    
    defer.reset = (resetTick)=>{
      resetScope += 1;
      wheelTick   = typeof resetTick === "number" ? resetTick : 0;
      finished    = false;
      nextWheelTick(wheelTick++,option.value,resetScope);
    }
    
    let nextWheelTick = (tick,value,tickScope)=>{
      let nowAction   = tasks[turn(tick,taskLength,1)];
      
      let nextTickFn  = passValue=>{
        //if reset called
        if(tickScope !== resetScope) return;
        //if over tick
        if(wheelTick > limit){
          return defer.reject(new Error("limit"));
        }
        if(finished === false){
          nextWheelTick(wheelTick++,passValue,tickScope);
        }
      }
      
      if(typeof nowAction === "function"){
        nowAction(
          {
            value:value,
            resolve:defer.resolve,
            reject:defer.reject,
            next:nextTickFn
          },
          Math.floor(tick/tasks.length),
          tick
        );
      } else if(typeof nowAction === "number"){
        setTimeout(()=>{ nextTickFn(value) },nowAction)
      }
    };
    
    defer.reset(0);
    
    return defer;
  }
  
  q.sequance = function(data,fn,serialPipeOutMode){
    if(typeof fn === "undefined"){
      fn = function(datum){
        if(typeof datum === "function"){
          return q(datum);
        }
      }
    }
      
    return q(function(resolve,reject){
      data = asArray(data);
          
      if(typeof serialPipeOutMode === "undefined"){
        serialPipeOutMode = typeof data[0] === "function";
      }
              
      var resolveResult = [];
      var index  = 0;
      var nextFn = function(beforeResolved){
        if(index < data.length){
          var fnResult;
          if(serialPipeOutMode){
            var serialPipeOutModeFunc = data[index++];
            if(typeof serialPipeOutModeFunc === "function"){
              fnResult = serialPipeOutModeFunc(beforeResolved,index,data.length);
            } else {
              fnResult = serialPipeOutModeFunc;
            }
          } else {
            fnResult = fn(data[index++],index-1);
          }
                  
          q.valueOf(fnResult)
          .then(function(r){
            if(r === q.break) return;
            resolveResult.push(r), nextFn(r);
          })
          .catch(function(reason){
            if(!serialPipeOutMode && (reason instanceof Error)){
              reason["success"] = data.slice(index-1);
            }
            reject(reason);
          });
          
        } else {
          return resolve(serialPipeOutMode ? beforeResolved : resolveResult);
        }
      };
      nextFn(fn);
    }); 
  };
  
  return q;
}(Promise));
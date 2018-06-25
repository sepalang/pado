import { isEqual } from '../functions/isLike'
import { cloneDeep } from '../functions'

const ManualReactive = function(watch, effect, judgeOfEqual){
  this.watch        = watch;
  this.effect       = effect;
  this.judgeOfEqual = typeof judgeOfEqual === "function" ? judgeOfEqual : (a,b)=>a===b;
  this.oldValue     = undefined;
};

ManualReactive.prototype = {
  beginAffect (watchValue){
    this.effect(watchValue,cloneDeep(this.oldValue));
    this.oldValue = watchValue;
  },
  digest (...args){
    const watchResult = this.watch.apply(this,args);
    return this.judgeOfEqual(this.oldValue, watchResult) ? false : (beginAffect(watchResult), true);
  }
}

export const affect = function(effect, judgeOfEqual){
  let affectValue      = undefined;
  const manualReactive = new ManualReactive(()=>affectValue, effect, judgeOfEqual);
  return (value)=>{ affectValue=value; manualReactive.digest(); };
}
import { isNumber, isArray, isAbsoluteNaN } from './isLike';

export const limitNumber = (function() {
  const limitOf = function(number, max, min) {
    if(typeof number == "number") {
      if(isAbsoluteNaN(number) || number === Infinity) {
        return min;
      }
      if(isNumber(min) && (number < min)) {
        return min;
      }
      if(isNumber(max) && (number > max)) {
        return max;
      }
    }
    return number;
  };
  const limitNumber = function(numbers, max, min) {
    if(typeof max !== "number") { max = Number.POSITIVE_INFINITY; }
    if(typeof min !== "number") {
      if(min === null || isAbsoluteNaN(min)) {
        min = Number.NEGATIVE_INFINITY;
      } else {
        min = 0;
      }
    }
    if(isArray(numbers)) {
      for(var d = numbers, i = 0, l = d.length; i < l; i++) {
        d[i] = limitOf(d[i], max, min);
      }
      return numbers;
    } else {
      return limitOf(numbers, max, min);
    }
  };
  return limitNumber;
}());

export const accurateTimeout = (function(originalTimeout){
  return function(trigger,time=0,resolutionRatio=0.75,coverage=25){
    let destTime = Date.now() + time;
    
    if(!isNumber(time)){
      time=0;
    }
    
    if(!isNumber(resolutionRatio)){
      resolutionRatio = 0.75
    }
    
    if(!isNumber(coverage)){
      resolutionRatio = 25
    }
    
    if(resolutionRatio > 1){
      resolutionRatio = 1;
    }
        
    if(resolutionRatio < 0.1){
      resolutionRatio = 0.1;
    }
    
    if(coverage < 5){
      coverage = 5;
    }
        
    function preparation(restTime){
      const preparaTime = Math.floor(restTime * resolutionRatio);
      originalTimeout(execution,preparaTime);
    }
        
    function execution(){
      const restTime = destTime - Date.now();
        
      if(restTime < coverage){
        if(restTime < 1){
          originalTimeout(trigger,0);
        } else {
          originalTimeout(trigger,restTime);
        }
      } else {
        preparation(restTime);
      }
    }
    
    execution();
  }
}(setTimeout));

export const turn = function(i, limit, ts, resultHook){
  if(i < 0) { 
    let abs = Math.abs(i / ts); 
    i = limit - (abs > limit ? abs % limit : abs);
  }
  ts = typeof ts === "number" ? ts : 1;
  i  = Math.floor(i / ts);
  const r = (limit > i) ? i : i % limit;
  return typeof resultHook === "function" ? resultHook(r,i,limit,ts) : i;
}

export const turnTimes = function (i, limit, ts){
  return turn(i, limit, ts, (r, i, limit, ts)=>{
    return [r, limit*ts/i];
  });
}

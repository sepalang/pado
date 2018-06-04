import { asArray, cloneDeep } from './cast'
import { isAbsoluteNaN } from './isLike'
import { top } from './reduce';
import { turn, limitOf } from './nice';
import { times } from './enumerable';

export const rangeModel = function(value,step,sizeBase){
  var start,end,reverse;
  
  if(typeof value === "number"){
    end   = value;
    start = 0;
  } else if(typeof value === "object"){
    start = value[0];
    end   = value[1];
      
    if(!step && typeof value[2] === "number"){
      step = value[2];
    }
      
    if(typeof sizeBase !== "boolean"){
      sizeBase=false;
    }
  }
  
  if(typeof start !== "number" || typeof end !== "number"){
    if(typeof start !== "number" && typeof end !== "number") return r;
    if(typeof start === "number") return r.push(start),r;
    if(typeof end   === "number") return r.push(end)  ,r;
  }
  
  if(start > end){
    reverse = end;
    end     = start;
    start   = reverse;
    reverse = true;
  }
  
  end=parseFloat(end),end=isAbsoluteNaN(end)?0:end;
  start=parseFloat(start),start=isAbsoluteNaN(start)?0:start;
  step=parseFloat(step),step=isAbsoluteNaN(step)||step==0?1:step;
  
  return {
    start,
    end,
    step,
    reverse,
    sizeBase
  }
};

export const range = function(value,stepSize,sizeBaseRange){
  let r=[];
  let {
    start,
    end,
    step,
    reverse,
    sizeBase
  } = rangeModel(value,stepSize,sizeBaseRange);
  
  if(step <= 0){ return console.warn("range::not support minus step"),r;};
  if(sizeBase==false){ for(var i=start,l=end;i<=l;i=i+step) r.push(i); } else { for(var i=start,l=end;i<l;i=i+step) r.push(i); }
  return reverse ? r.reverse() : r;
}

//TODO : move to ?
export const hashMap = function(d,f){
  if(typeof d === "object" && !isArray(d)){
    for(let k in d) d[k] = f(d[k],k); 
  } else {
    return f(d,(void 0));
  }
  return d;
};

export const domainRangeValue = function(domain,range,vs,nice,limit){
  return hashMap(cloneDeep(vs),function(v,sel){
    const $range  = sel ? range[sel]  : range;
    const $domain = sel ? domain[sel] : domain;
    if(!$range || !$domain){ return v; }
                    
    const dSize = $domain[1] - $domain[0];
    const sSize = $range[1] - $range[0];
    const dRate = (v - $domain[0]) / dSize;
    const calc  = $range[0] + sSize * dRate;
    const result = nice ? Math.floor(calc) : calc;
    
    return limit ? 
    $range[1] > $range[0] ? 
    limitOf(result,$range[1],$range[0]) :
    limitOf(result,$range[0],$range[1]) :
    result;
  });
};

export const domainRangeInterpolate = function(domain,range,nice,limit){
  let _domain = domain;
  let _range  = range;
  let _nice   = nice;
  
  const interpolate = (value)=>domainRangeValue(_domain,_range,value,_nice,limit);
  
  interpolate.domain = (domain)=>{
    _domain = domain;
    return interpolate;
  }
  interpolate.range = (range)=>{
    _range = range
    return interpolate;
  }
  interpolate.nice = (nice)=>{
    _nice = nice;
    return interpolate;
  }
  
  return interpolate;
};

//matrixRange([1],[3]) // [[1], [2], [3]] 
//matrixRange([1,1],[3,3]) // [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]

export const matrixRange = function(start,end,step,sizeBase){
  var scales=[];
  var maxLength = top([start.length,end.length]);
    
  var selectLengthes = times(maxLength,function(scaleIndex){
    var range = range([start[scaleIndex],end[scaleIndex]],step,sizeBase)
    scales.push(range);
    return range.length;
  });

  var result = times(reduce(selectLengthes,function(redu,value){
    return redu * value;
  },1),function(){ return new Array(maxLength); });
    
  var turnSize = 1;
  
  
  asArray(scales).forEach((scaleCase,scaleIndex)=>{
    var scaleCaseLength = scaleCase.length;
    times(result.length,function(time){
      result[time][scaleIndex] = scaleCase[turn(time,scaleCaseLength,turnSize)];
    });
    turnSize = turnSize * scaleCaseLength;
  });
    
  return result;
};
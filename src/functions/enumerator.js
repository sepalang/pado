import {
  asArray
} from './transform'

export const all = function(data,fn){
  data = asArray(data);
  
  if(data.length === 0){
    return false;
  }
  
  for(let i=0,l=data.length;i<l;i++) if(!fn(data[i],i)){
    return false;
  };
  
  return true;
};

export const times = function(length,fn){
  const result = [];
  for(var i=0,l=length;i<l;i++){
    result.push(fn(i));
  }
  return result;
}
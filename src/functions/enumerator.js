import {
  asArray
} from './asTo'

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

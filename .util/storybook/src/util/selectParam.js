import { text, select } from '@storybook/addon-knobs';
export { text, select } from '@storybook/addon-knobs';
export { withKnobs }  from '@storybook/addon-knobs';

export const params = function(prefix="",knobsOptions=[]){
  if(typeof prefix === "string" && prefix.length){
    prefix +=" ";
  }

  return knobsOptions.map((argv,index)=>{
    const key = `${prefix}i${index}`
    return text(key, argv);
  });
}

export const selectParam = function(prefix="",knobsOptions){
  if(typeof prefix === "string" && prefix.length){
    prefix +=" ";
  }
  
  const knobsSelect = select(`${prefix}select`, knobsOptions.reduce((dest,value,index)=>{
    const key = `${prefix}Param${index+1}`;
    dest[String(index)] = key;
    return dest;
  },{}), "0");
  
  const knobsHash = knobsOptions.reduce((dest,value,index)=>{
    const key = `${prefix}Param${index+1}`;
    dest[String(index)] = text(key,value);
    return dest;
  },{});
  
  return knobsHash[knobsSelect];
};
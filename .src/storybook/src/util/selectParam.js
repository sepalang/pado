import { text, select } from '@storybook/addon-knobs/vue';
export { text, select } from '@storybook/addon-knobs/vue';
export { withKnobs }  from '@storybook/addon-knobs/vue';

export const selectParam = function(prefix="",knobsOptions){
  
  if(typeof prefix === "string" && prefix.length){
    prefix +=" ";
  }
  
  const knobsSelect = select(`${prefix}opts`, knobsOptions.reduce((dest,value,index)=>{
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
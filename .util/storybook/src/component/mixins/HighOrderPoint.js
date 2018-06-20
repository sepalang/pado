/*
  HighOrderPoint([["x","y","point"],[0,0]])
  HighOrderPoint([["left","top","point"],[0,0]])
*/

const DEFAULT_POINT_SIZE_VALUE = 20;
export default function(...options){
  if(!options.length){
    options=[[[],[]]];
  }
  
  const props={};
  const computed={};
  
  options.forEach(([ keys=[], defaultValues=[] ])=>{
    const [xKey="x", yKey="y", pointKey="point"] = keys;
    const [xParam=DEFAULT_POINT_SIZE_VALUE, yParam=DEFAULT_POINT_SIZE_VALUE] = defaultValues;
    
    Object.assign(props,{
      [ xKey ] : { default:xParam },
      [ yKey ] : { default:yParam }
    })
    
    const pointValueKey = pointKey + "Value";
    
    Object.assign(computed,{
      [ pointValueKey ]:function(){
        return {
          [ xKey ]:parseInt(this[xKey], 10),
          [ yKey ]:parseInt(this[yKey], 10)
        };
      }
    })
  });
  
  const highOrderMixins = { props, computed };
  return highOrderMixins;
}
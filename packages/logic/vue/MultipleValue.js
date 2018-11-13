export default function (attributeNames){
  
  const props = [];
  const computed = {};
  const methods = {};
  
  attributeNames.forEach((name)=>{
    const computedName = `${name}Value`;
    const methodsName = `has${name.substr(0,1).toUpperCase() + name.substr(1)}`;
    
    props.push(name);
    computed[computedName] = function(){
      const mixins = this.mixins;
      return typeof mixins === "string" ? mixins.split(/[\s]+/) : [];
    }
    methods[methodsName] = function(name){
      const computedValue = this[computedName];
      return computedValue.includes(name);
    }
  });
  
  const HighOrderMixins = { props, computed, methods };
  return HighOrderMixins
}

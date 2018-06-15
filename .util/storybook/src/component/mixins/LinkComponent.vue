<script>
const LinkClass = (function(){
  const Link = function(vueInstance){
    this._events = {};
    this.methods = {};
    Object.defineProperty(this,"vue",{
      get:()=>vueInstance
    });
    Object.defineProperties(this.methods, Object.keys(vueInstance.$options.methods).reduce((dest,fnName)=>{
      dest[fnName] = {
        get (){
          return function(...args){
            return vueInstance[fnName].apply(vueInstance,args);
          }
        }
      };
      return dest;
    },{}));
  };
  
  const addOn = function(link, eventName, fn){
    if(!link._events[eventName]){
      link._events[eventName] = [];
    }
    link._events[eventName].push(fn);
  };

  const LinkPrototype = {
    on:function(event,fn){
      if(typeof event === "object"){
        Object.keys(event).forEach(eventName=>{
          addOn(this,eventName,event[eventName]);
        });
      } else {
        addOn(this,event,fn)
      }
    },
    dispatch:async function(event,send){
      if(!this._events[event]){
        return [];
      }
      return await Promise.all(this._events[event].map(fn=>{
        const onResult = fn.call(this.vue, send);
        return onResult;
      }));
    }
  };
  
  Link.prototype = LinkPrototype;
  
  return Link;
}());

export default {
  beforeCreate (){
    this.$link = new LinkClass(this);
    this.$emit("link",this.$link);
  }
}
</script>
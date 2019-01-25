<script lang="ts">
import { asArray, toggle, likeNumber, removeValue } from '@/utils';
import _cloneDeep from 'lodash/cloneDeep';

//import { editable } from '@/utils/editable';

const opposite = function(value){
  if(typeof value === "boolean"){
    return !value;
  }
  return value;
}

const contextsGenerator = ({
  ref,
  nodeList,
  alias
})=>{
  const cachedContextName = `__cached${alias}Context`;
  const cachedContextIdName = `__cached${alias}ContextId`;
  const cachedNodelistContext = ref[cachedContextName] || [];
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  ref[cachedContextIdName] = ref[cachedContextIdName] || 0;
  
  const contextKey = ref.contextKey;
  const useContextKey = typeof contextKey === "string";
  
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  ref[cachedContextName] = nodeList.map(datum=>{
    
    let context = cachedNodelistContext.find(
      useContextKey
        ? (oldCtx)=>oldCtx.datum[contextKey] === datum[contextKey]
        : (oldCtx)=>oldCtx.datum === datum
    );
  
    if(!context){
      context = {};
      let defaultContextOption = {
        context: {
          enumerable: false,
          get: ()=>context
        },
        key: {
          enumerable: true,
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          value: `${ref._uid}-${ref.__cachedNodelistContextId++}`
        },
        depth: {
          enumerable: true,
          get: ()=>ref.depth
        },
        toggle: {
          enumerable: true,
          get (){ return (key, toggleValues)=>{ return ref.toggle(this.datum, key, toggleValues); }; }
        },
        toggleOnly: {
          enumerable: true,
          get (){ return (key, toggleValues)=>{ return ref.toggleOnly(this.datum, key, toggleValues); }; }
        },
        input: {
          enumerable: true,
          get (){ return (key, val)=>{ return ref.inputProperty(this.datum, key, val); }; }
        },
        inputOnly: {
          enumerable: true,
          get (){ return (key, val)=>{ return ref.inputPropertyOnly(this.datum, key, val); }; }
        },
        inputAll: {
          enumerable: true,
          get (){ return val=>{ return ref.inputAll(this.datum, val); }; }
        },
        is: {
          enumerable: true,
          get (){ return key=>{ return ref.is(this.datum, key); }; }
        },
        children: {
          enumerable: false,
          get (){ return this.datum[ref.children] instanceof Array ? this.datum[ref.children] : []; }
        },
        defined: {
          enumerable: true,
          get (){ return (key)=>typeof this.datum[`$${key}`] !== 'undefined'; }
        },
        hasChildren: {
          enumerable: true,
          get (){ return this.datum.hasOwnProperty(ref.children) && !!this.children.length; }
        },
        visibleChildren: {
          enumerable: true,
          get (){ return this.isOpen && this.hasChildren; }
        }
      };
      
      // editable
      Object.assign(defaultContextOption, {
        duplicate :{
          enumerable: true,
          get (){
            return ()=>{
              const nodes = ref.nodes;
              const cloneDatum = _cloneDeep(this.datum);
              nodes.push(cloneDatum);
              return cloneDatum;
            }
          }
        },
        remove: {
          enumerable: true,
          get (){
            return ()=>{
              const nodes = ref.nodes;
              const datum = this.datum;
              removeValue(nodes, datum);
              return datum;
            }
          }
        },
        reform: {
          enumerable: true,
          get (){
            return ()=>{ 
              const originDatum = this.datum;
              const reformDatum = ref.createDatum();
            
              //Object.keys(originDatum).forEach(key=>{
              //  delete originDatum[key];
              //});
            
              Object.keys(reformDatum).forEach(key=>{
                ref.$set(originDatum,key,reformDatum[key]);
              });
              
              return originDatum;
            }
          }
        }
      });
      
      // state
      Object.assign(defaultContextOption, {
        open: {
          enumerable: true,
          get (){ return (toggleValues)=>{ this.toggle('open', toggleValues); }; }
        },
        selected: {
          enumerable: true,
          get (){ return (toggleValues)=>{ this.toggleOnly('selected', toggleValues); }; }
        },
        checked: {
          enumerable: true,
          get (){ return (toggleValues)=>{ this.toggle('checked', toggleValues); }; }
        },
        isOpen: {
          enumerable: true,
          get (){  return this.is('open'); }
        },
        isSelected: {
          enumerable: true,
          get (){ return this.is('selected'); }
        },
        isChecked: {
          enumerable: true,
          get (){ return this.is('checked'); }
        }
      });
      Object.defineProperties(context, defaultContextOption);
    }
    Object.defineProperties(context, {
      datum: {
        configurable: true,
        enumerable: false,
        get         : ()=>datum
      },
      isFirst: {
        configurable: true,
        enumerable: true,
        get (){ return ref.nodes[0] === this.datum; }
      },
      isLast: {
        configurable: true,
        enumerable: true,
        get (){ return ref.nodes[ref.nodes.length - 1] === this.datum; }
      }
    });
    return context;
  });

  return ref[cachedContextName];
}

export default {
  render (h){
    const slot = this.$scopedSlots.default 
      ? this.$scopedSlots.default({
        model   : this.model,
        contexts: this.contexts,
        space   : this.spaceScope,
        depth   : this.depth
      }) 
      : [ this.$slots.default ];
    return h(this.tag, { class: 'v-nodelist', attr: this.$attr }, slot);
  },
  model: {
    prop: "model"
  },
  data:()=>({ spaceData:undefined }),
  props: {
    model: {
      type: Array
    },
    tag: {
      type: String,
      default (){
        return this.$vnode.data.tag;
      }
    },
    children: {
      type   : [String, Number],
      default: '$children'
    },
    space: {
      default: undefined
    },
    create: {
      
    },
    contextKey: {
      type   : String,
      default: undefined
    }
  },
  computed: {
    __vnodecomponent (){
      return true;
    },
    depth (){
      return this.parentNodeComponents().length;
    },
    nodes (){
      return this.model || [];
    },
    contexts (){
      const contexts = contextsGenerator({
        ref:this,
        nodeList:this.nodes,
        alias:"Nodelist"
      });
      return contexts;
    },
    spaceNodes (){
      const space = this.space;
      
      if(Array.isArray(space)){
        return space;
      }
      
      //initialize space
      if(!Array.isArray(this.spaceData)){
        const newSpace = [];
        
        if(likeNumber(space)){
          const requireSpaceLength = parseInt(space);
          
          for(let i=0,l=requireSpaceLength;i<l;i++){
            newSpace.push(this.createDatum());
          }
        }
        
        this.spaceData = newSpace;
      }
      
      return this.spaceData;
    },
    spaceScope (){
      const spaceNodes = this.spaceNodes;
      const spaceContexts = contextsGenerator({
        ref:this,
        nodeList:spaceNodes,
        alias:"Space"
      });
      
      return {
        contexts:spaceContexts
      };
    },
    isEditable (){
      return typeof this.editable === "string" || this.editable === true;
    }
  },
  methods: {
    parentNodeComponent (){
      let result;
      let target = this;
      do {
        target = target.$parent;
        target && target.__vnodecomponent && (result = target);
      } while(target && !result);
      return result;
    },
    parentNodeComponents (){
      const result = [];
      let target = this;
      do {
        target = target.$parent;
        target && target.__vnodecomponent && result.push(target);
      } while(target);
      return result;
    },
    findRootComponent (){
      const parents = this.parentNodeComponents();
      return parents[parents.length - 1] || this;
    },
    dispatchBubble (emitProps){
      this.$emit("bubble", emitProps);
      const parentComponent = this.parentNodeComponent();
      if(parentComponent){
        parentComponent.dispatchBubble(emitProps);
      }
    },
    inputProperty (datum, propertyKey, value, resolve, dispatch=true){
      const name  = `$${propertyKey}`;
      const resolved = typeof resolve === "function" ? resolve(datum, name) : true;
      
      if(resolved){
        const setValue = typeof value === "function" ? value(datum, name) : value;
        const cachedNodelistContext = this.__cachedNodelistContext;
        const depth = this.depth;
        
        this.$set(datum, name, setValue);
        
        
        dispatch && this.dispatchBubble({ 
          datum, 
          key    : propertyKey, 
          name, 
          value  : datum[name], 
          context: cachedNodelistContext.find(context=>context.datum === datum),
          depth  : depth
        });
      }
      
      return datum[name];
    },
    inputPropertyOnly (datum, propertyKey, value, resolve, dispatch=true){
      const name  = `$${propertyKey}`;
      const resolved = typeof resolve === "function" ? resolve(datum, name) : true;
      
      if(resolved){
        const setValue = typeof value === "function" ? value : ()=>value;
        this.inputProperty(datum, propertyKey, setValue, true, dispatch);
        
        //
        const oppositeValue = (datum, name)=>opposite( setValue(datum, name) ) 
        this.nodes.forEach(item=>{
          if(datum !== item){
            this.inputProperty(item, propertyKey, oppositeValue, true, false);
          }
        });
        
      }
    },
    toggle (datum, propertyKey, toggleValues = [true, false]){
      toggleValues = asArray(toggleValues);
      !toggleValues.length && (toggleValues = [true, false]);
      return this.inputProperty(datum, propertyKey, (datum, name)=>toggle(toggleValues, datum[name]));
    },
    toggleOnly (datum, propertyKey, toggleValues){
      toggleValues = asArray(toggleValues);
      !toggleValues.length && (toggleValues = [true, false]);

      let nextValue; 
      let propName;
      
      const returnValue = this.inputProperty(datum, propertyKey, (datum, name)=>{
        propName = name;
        nextValue = toggle(toggleValues, datum[propName]);
      });
    
      this.nodes.forEach(item=>{
        datum !== item && this.inputProperty(item, propertyKey, ()=>false, (item, name)=>{ return item[name] === true; });
      });
    
      datum[propName] = nextValue;
      return returnValue;
    },
    inputAll (propertyKey, value){
      this.nodes.forEach(datum=>{
        this.inputProperty(datum, propertyKey, value);
      });
      return value;
    },
    touchState (datum, propertyKey){
      const name = `$${propertyKey}`;
      !datum.hasOwnProperty(name) && this.$set(datum, name, undefined);
    },
    is (datum, propertyKey){
      const name = `$${propertyKey}`;
      this.touchState(datum, propertyKey);
      return datum[name] === true;
    },
    createDatum (...args){
      const create = this.create;
      let createDatum = undefined;
      
      if(typeof create === "function"){
        createDatum = create(...args);
      }
      
      return (typeof createDatum === "object" && createDatum) ? createDatum : {};
    },
    add (){
      
    }
  }
};
</script>

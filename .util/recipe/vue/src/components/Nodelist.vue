<script>
import { asArray, toggle } from '../../../../../.src/functions';

export default {
  render (h){
    const slot = this.$scopedSlots.default 
      ? this.$scopedSlots.default({
        model   : this.model,
        contexts: this.contexts,
        depth   : this.depth
      }) 
      : [ this.$slots.default ];
    return h(this.tag, { class: 'v-nodelist', attr: this.$attr }, slot);
  },
  model: {
    prop: "model"
  },
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
    //requireState: {
    //  default (){
    //    return ["open", "selected", "checked", "pending", "children"];
    //  }
    //},
    children: {
      type   : [String, Number],
      default: '$children'
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
    //requireStateList (){
    //  if(typeof this.requireState === "string"){
    //    return this.requireState.split(/[\s\,]+/).filter(s=>!!s);
    //  }
    //  if(this.requireState instanceof Array){
    //    return this.requireState.filter(s=>typeof s === "string");
    //  }
    //  return [];
    //},
    contexts (){
      const rootModel = this.nodes;
      const cachedNodelistContext = this.__cachedNodelistContext || [];
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.__cachedNodelistContextId = this.__cachedNodelistContextId || 0;
      const contextKey = this.contextKey;
      const useContextKey = typeof contextKey === "string";
      const ref = this;
      
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.__cachedNodelistContext = rootModel.map(datum=>{
        let context = cachedNodelistContext.find(
          useContextKey
            ? (oldCtx)=>oldCtx.datum[contextKey] === datum[contextKey]
            : (oldCtx)=>oldCtx.datum === datum
        );
      
        if(!context){
          context = {};
          Object.defineProperties(context, {
            key: {
              enumerable: true,
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              value     : `${ref._uid}-${this.__cachedNodelistContextId++}`
            },
            depth: {
              enumerable: true,
              get       : ()=>ref.depth
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
            inputAll: {
              enumerable: true,
              get (){ return val=>{ return ref.inputAll(this.datum, val); }; }
            },
            is: {
              enumerable: true,
              get (){ return key=>{ return ref.is(this.datum, key); }; }
            },
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
              get (){ return this.is('open'); }
            },
            isSelected: {
              enumerable: true,
              get (){ return this.is('selected'); }
            },
            isChecked: {
              enumerable: true,
              get (){ return this.is('checked'); }
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
          });
        }      
      
        Object.defineProperties(context, {
          datum: {
            configurable: true,
            enumerable  : false,
            get         : ()=>datum
          },
          isFirst: {
            configurable: true,
            enumerable  : true,
            get (){ return ref.nodes[0] === this.datum; }
          },
          isLast: {
            configurable: true,
            enumerable  : true,
            get (){ return ref.nodes[ref.nodes.length - 1] === this.datum; }
          }
        });
      
        return context;
      });
    
      return this.__cachedNodelistContext;
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
    inputProperty (datum, propertyKey, value, resolve){
      const name  = `$${propertyKey}`;
      (typeof resolve === "function" ? resolve(datum, name) : true) && this.$set(datum, name, typeof value === "function" ? value(datum, name) : value);
    
      this.dispatchBubble({ 
        datum, 
        key    : propertyKey, 
        name, 
        value  : datum[name], 
        context: this.__cachedNodelistContext.find(context=>context.datum === datum),
        depth  : this.depth
      });
      
      return datum[name];
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
    }
  }
};

</script>

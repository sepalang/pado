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
    children: {
      type   : [String, Number],
      default: 'children'
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
              // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              value: `${ref._uid}-${this.__cachedNodelistContextId++}`
            },
            depth: {
              get: ()=>ref.depth
            },
            toggle: {
              get (){ return (key, toggleValues)=>{ return ref.toggle(this.datum, key, toggleValues); }; }
            },
            toggleOnly: {
              get (){ return (key, toggleValues)=>{ return ref.toggleOnly(this.datum, key, toggleValues); }; }
            },
            inputAll: {
              get (){ return val=>{ return ref.inputAll(this.datum, val); }; }
            },
            is: {
              get (){ return key=>{ return ref.is(this.datum, key); }; }
            },
            open: {
              get (){ return (toggleValues)=>{ this.toggle('open', toggleValues); }; }
            },
            selected: {
              get (){ return (toggleValues)=>{ this.toggleOnly('selected', toggleValues); }; }
            },
            checked: {
              get (){ return (toggleValues)=>{ this.toggle('checked', toggleValues); }; }
            },
            isOpen: {
              get (){ return this.is('open'); }
            },
            isSelected: {
              get (){ return this.is('selected'); }
            },
            isChecked: {
              get (){ return this.is('checked'); }
            },
            children: {
              get (){ return this.datum[ref.children] instanceof Array ? this.datum[ref.children] : []; }
            },
            hasChildren: {
              get (){ return this.datum.hasOwnProperty(ref.children) && !!this.children.length; }
            },
            visibleChildren: {
              get (){ return this.isOpen && this.hasChildren; }
            }
          });
        }
        
        Object.defineProperties(context, {
          datum: {
            configurable: true,
            get         : ()=>datum
          },
          isFirst: {
            configurable: true,
            get (){ return ref.nodes[0] === this.datum; }
          },
          isLast: {
            configurable: true,
            get (){ return ref.nodes[ref.nodes.length - 1] === this.datum; }
          }
        });
        
        return context;
      });
      
      return this.__cachedNodelistContext;
    }
  },
  methods: {
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
    inputProperty (datum, propertyKey, value, resolve){
      const name  = `$${propertyKey}`;
      (typeof resolve === "function" ? resolve(datum, name) : true) && this.$set(datum, name, typeof value === "function" ? value(datum, name) : value);
      this.$emit("state", { datum, name, value });
    },
    toggle (datum, propertyKey, toggleValues = [true, false]){
      toggleValues = asArray(toggleValues);
      !toggleValues.length && (toggleValues = [true, false]);
      this.inputProperty(datum, propertyKey, (datum, name)=>toggle(toggleValues, datum[name]));
    },
    toggleOnly (datum, propertyKey, toggleValues){
      toggleValues = asArray(toggleValues);
      !toggleValues.length && (toggleValues = [true, false]);
      this.nodes.forEach(item=>{
        datum !== item && this.inputProperty(item, propertyKey, ()=>toggle(toggleValues, toggleValues[0]), (item, name)=>{ return item[name] === toggleValues[0]; });
      });
      this.inputProperty(datum, propertyKey, (datum, name)=>toggle(toggleValues, datum[name]));
    },
    inputAll (propertyKey, value){
      this.nodes.forEach(datum=>{
        this.inputProperty(datum, propertyKey, value);
      });
    },
    is (datum, propertyKey){
      return datum[`$${propertyKey}`] === true;
    }
  }
};
</script>

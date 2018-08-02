<script>
export default {
  render (h){
    const slot = this.$scopedSlots.default 
      ? this.$scopedSlots.default({
        model   : this.model,
        contexts: this.contexts,
        depth   : this.depth
      }) 
      : [ this.$slots.default ];
    return h(this.tag, { class: 'v-node', attr: this.$attr }, slot);
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
      return this.model.map(datum=>{
        const context = {};
        
        Object.defineProperties(context, {
          datum: {
            get: ()=>datum
          },
          depth: {
            get: ()=>this.depth
          },
          toggle: {
            get: ()=>key=>{ return this.toggle(datum, key); }
          },
          toggleOnly: {
            get: ()=>key=>{ return this.toggleOnly(datum, key); }
          },
          inputAll: {
            get: ()=>val=>{ return this.inputAll(datum, val); }
          },
          is: {
            get: ()=>key=>{ return this.is(datum, key); }
          },
          open: {
            get: ()=>()=>{ context.toggle('open'); }
          },
          selected: {
            get: ()=>()=>{ context.toggleOnly('selected'); }
          },
          checked: {
            get: ()=>()=>{ context.toggle('checked'); }
          },
          isOpen: {
            get: ()=>context.is('open')
          },
          isSelected: {
            get: ()=>context.is('selected')
          },
          isChecked: {
            get: ()=>context.is('checked')
          },
          children: {
            get: ()=>datum[this.children] instanceof Array ? datum[this.children] : []
          },
          hasChildren: {
            get: ()=>datum.hasOwnProperty(this.children) && !!context.children.length
          },
          visibleChildren: {
            get: ()=>context.isOpen && context.hasChildren
          }
        });
        
        return context;
      });
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
      typeof resolve === "function" ? resolve(datum, name) : true && this.$set(datum, name, typeof value === "function" ? value(datum, name) : value);
      this.$emit("state", { datum, name, value });
    },
    toggle (datum, propertyKey){
      this.inputProperty(datum, propertyKey, (datum, name)=>!datum[name]);
    },
    toggleOnly (datum, propertyKey){
      this.nodes.forEach(item=>{
        datum !== item && this.inputProperty(datum, propertyKey, ()=>false, (datum, name)=>datum[name] === true);
      });
      this.inputProperty(datum, propertyKey, (datum, name)=>!datum[name]);
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

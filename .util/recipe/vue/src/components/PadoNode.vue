<script>
export default {
  render (h){
    const slot = this.$scopedSlots.default 
      ? this.$scopedSlots.default({
        model         : this.model,
        toggleOpen    : this.toggleOpen,
        toggleSelected: this.toggleSelected,
        toggleChecked : this.toggleChecked,
        depth         : this.depth,
        isOpen        : this.isOpen,
        hasChildren   : this.hasChildren
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
      default (){
        return this.$vnode.data.tag;
      }
    },
    children: {
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
    toggleOpen (item){
      const destOpenValue = !item.$open;
      this.$set(item, '$open', destOpenValue);
    },
    toggleSelected (item){
      this.nodes.forEach(datum=>{
        datum !== item && this.$set(datum, '$selected', false);
      });
      const destOpenValue = !item.$selected;
      this.$set(item, '$selected', destOpenValue);
    },
    toggleChecked (item){
      const destOpenValue = !item.$checked;
      this.$set(item, '$checked', destOpenValue);
    },
    isOpen (item){
      return item.$open === true;
    },
    hasChildren (item){
      return item[this.children] && item[this.children].length;
    }
  }
};
</script>

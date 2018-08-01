<script>
export default {
  render (h){
    const defaultSlot = this.$slots.default[0];
    console.log("defaultSlot", defaultSlot);
    if(!defaultSlot.directives) defaultSlot.directives = [];
    defaultSlot.directives.push({
      name : "v-for",
      value: ''
    });
    
    return defaultSlot;
    
    return h(
      this.tag,
      this.$attrs,
      [ defaultSlot ]
    );
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
    nested: {
      type   : Boolean,
      default: false
    },
    id: {
      default: 'id'
    },
    listStyle: {
      default: false
    },
    // only use nested mode.
    children: {
      default: 'children'
    }
  }
};
</script>

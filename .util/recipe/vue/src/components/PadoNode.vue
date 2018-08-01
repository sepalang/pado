<script>
export default {
  render (h, context){
    const slot = this.$scopedSlots.default 
      ? this.$scopedSlots.default({
        foo  : "bar",
        model: this.model
      }) 
      : [ this.$slots.default ];
    
    return h(this.tag, { attr: this.$attr }, slot);
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
    }
  },
  mounted (){
    console.log("mounted", this.model);
  }
};
</script>

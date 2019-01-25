<script lang="ts">
export default {
  render (h){
    const slot = this.$scopedSlots.default ? this.$scopedSlots.default({ model : this.model, alias: this.computedAlias }) : [ this.$slots.default ];
    return h(this.tag, { class: 've-nodelist', attr: this.$attr }, slot);
  },
  model: {
    prop: "model"
  },
  props: {
    model: {
      type: [Object, Array]
    },
    alias: {
      type: Object
    },
    tag: {
      type: String,
      default (){
        return this.$vnode.data.tag;
      }
    }
  },
  computed: {
    computedAlias (){
      const alias = this.alias;
      const result = {};
      
      if(typeof alias === "object" && alias){
        Object.keys(alias).forEach(key=>{
          result[key] = alias[key];
        });
      }
      
      return result;
    }
  }
};
</script>

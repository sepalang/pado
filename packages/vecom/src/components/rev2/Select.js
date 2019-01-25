import { Vue, Component, Model } from 'nuxt-property-decorator';

export default ()=>{
  @Component({
    provide (){
      return { parentComponent: this }
    }
  })
  class Select extends Vue {
    @Model('commit') model: any;
    
    created (){
      this.$on("ve-option-item-on-pointer-start",({ $event, value })=>{
        const beforeEvent = { prevent:false, $event, value };
        this.$emit("beforeInput",beforeEvent);
        if(beforeEvent.prevent === true) return;
        if(typeof this.$el.getAttribute("disabled") === "string") return ;
        if(typeof this.$el.getAttribute("readOnly") === "string") return ;
        this.$emit("commit",value);
        this.$emit("input",value);
      });
    }
    
  }
  return Select;
}

export default {
  props: ['multiple','selected'],
  model: {
    prop :'selected',
    event:'change'
  },
  data:()=>({ SelectInterfaceMode:"default" }),
  watch:{
    selected (selected){
      this.$children.forEach(selectItemVM=>selectItemVM.$emit("inherit-select-state",this.$inheritSelectState()));
    }
  },
  created (){
    const useMultiple = typeof this.multiple === "string";
    
    this.$isSelectedValue = (value)=>{
      //mode
      switch(this.SelectInterfaceMode){
        case "tab":
        default:
          
          default;
      }
    };
    this.$inheritSelectState = ()=>{
      return { model:this.selected, isSelectedValue:this.$isSelectedValue };
    };
    
    //
    this.$on("select-item-select-action",item => {
      if(typeof this.$el.getAttribute("disabled") === "string") return;
      if(typeof this.$el.getAttribute("readOnly") === "string") return;
      this.$emit("change",item);
    });
    
    //
    this.$on("select-item-mounted",selectItemVM=>selectItemVM.$emit("inherit-select-state",this.$inheritSelectState()));
  }
};
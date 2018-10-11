export default function (...options){
  const base = {
    model: {
      prop : "model",
      event: "change"
    },
    props: {
      model  : {},
      value  : {},
      unvalue: {}
    },
    computed: {
      modelValue: {
        get: function (){
          return this.model;
        },
        set: function (value){
          this.$emit("change", value);
        }
      },
      positiveValue (){
        return !this.$options.propsData.hasOwnProperty("value") ? true : this.value;
      },
      negativeValue (){
        return !this.$options.propsData.hasOwnProperty("unvalue") ? undefined : this.unvalue;
      },
      isToggleActive (){
        return this.$options.propsData.hasOwnProperty("unvalue");
      },
      isChecked (){
        return this.modelValue === this.positiveValue;
      }
    },
    methods: {
      input (){
        if(
          typeof this.$el.getAttribute("disabled") === "string" || 
          typeof this.$el.getAttribute("readOnly") === "string"
        ){
          return;
        }
        
        if(this.modelValue !== this.positiveValue){
          this.modelValue = this.positiveValue;
        } else if(this.isToggleActive){
          this.modelValue = this.negativeValue;
        }
      }
    }
  };
  
  return base;
}

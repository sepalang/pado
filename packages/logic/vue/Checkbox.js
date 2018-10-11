import { asArray, removeValue } from '@sepalang/pado/functions/cast';

export default function (...options){
  const base = {
    model: {
      prop : "model",
      event: "change"
    },
    props: {
      model   : {},
      value   : {},
      unvalue : {},
      multiple: {}
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
      isMultiple (){
        return typeof this.multiple === 'string';
      },
      positiveValue (){
        return !this.$options.propsData.hasOwnProperty("value") ? true : this.value;
      },
      negativeValue (){
        return !this.$options.propsData.hasOwnProperty("unvalue") ? false : this.unvalue;
      },
      isChecked (){
        return this.isMultiple
          ? asArray(this.modelValue).some(modelDatum=>modelDatum === this.positiveValue)
          : this.modelValue === this.positiveValue;
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
        
        if(this.isMultiple){
          const modelValue = asArray(this.modelValue);
          
          modelValue.some(modelDatum=>modelDatum === this.positiveValue)
            ? removeValue(modelValue, this.positiveValue)
            : modelValue.push(this.positiveValue);
            
          this.modelValue = modelValue;
        } else {
          this.modelValue = this.modelValue === this.positiveValue ? this.negativeValue : this.positiveValue;
        }
      }
    }
  };
  
  return base;
}

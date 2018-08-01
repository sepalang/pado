import { asArray, removeValue } from '../../../../../../.src/functions/cast';

export default function (...options){
  const base = {
    model: {
      prop : "model",
      event: "change"
    },
    props   : ["model", "value", "toggle"],
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
      isChecked (){
        return this.isMultiple
          ? asArray(this.modelValue).some(modelDatum=>modelDatum === this.value)
          : this.modelValue === this.value;
      },
      positiveValue (){
        return typeof this.value === "undefined" ? true : this.value;
      },
      negativeValue (){
        return typeof this.value === "undefined" ? true : undefined;
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
          
          modelValue.some(modelDatum=>modelDatum != this.value)
            ? modelValue.push(this.value)
            : removeValue(modelValue, this.value);
          
          this.modelValue = modelValue;
        } else {
          this.modelValue = this.positiveValue === this.modelValue ? this.negativeValue : this.positiveValue;
        }
      }
    }
  };
  
  return base;
}

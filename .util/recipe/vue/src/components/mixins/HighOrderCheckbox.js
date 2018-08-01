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
      isChecked (){
        return typeof this.multiple === 'string'
          ? asArray(this.modelValue).some(modelDatum=>modelDatum === this.value)
          : this.modelValue === this.value;
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
        
        if(typeof this.multiple === 'string'){
          const modelValue = asArray(this.modelValue);
          
          modelValue.some(modelDatum=>modelDatum != this.value)
            ? modelValue.push(this.value)
            : removeValue(modelValue, this.value);
          
          this.modelValue = modelValue;
        } else {
          this.modelValue = this.value === this.modelValue ? undefined : this.value;
        }
      }
    }
  };
  
  return base;
}

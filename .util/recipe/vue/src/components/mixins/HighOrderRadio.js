export default function (...options){
  const base = {
    model: {
      prop : "model",
      event: "change"
    },
    props   : ["model", "value", "toggle"],
    computed: {
      radioValue: {
        get: function (){
          return this.model;
        },
        set: function (value){
          this.$emit("change", value);
        }
      },
      isChecked (){
        return this.radioValue === this.value;
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
        this.radioValue = this.value;
      }
    }
  };
  
  return base;
}

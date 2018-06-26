import { affect } from '../../../../../.src/modules';

export default function({ name='' }={}){
  
  const HighOrderMixins = {
    props: ['value'],
    data : ()=>({ selected:false }),
    methods: {
      inheritValue (inherit){
        this.selected = this.value === null ? false : (this.value === inherit);
      },
      selectItem () {
        const value = this.value;
        this.$parent && this.$parent.$emit('select-item-select-action',value);
        this.$emit('input',value);
      }
    },
    created (){
      const affectSelectedAttribute = affect(value=>{
        if(value){
          this.$el.setAttribute("selected","");
        } else {
          this.$el.removeAttribute("selected");
        }
      });
    
      this.$on("inherit-select-state",({ isSelectedValue })=>{
        affectSelectedAttribute(isSelectedValue(this.value))
      });
    },
    mounted (){
      this.$el.addEventListener("click",({ currentTarget })=>{
        return (
          typeof currentTarget.getAttribute("readOnly") === "string" ||
          typeof currentTarget.getAttribute("disabled") === "string"
        ) ? undefined : this.selectItem();
      });
    
      this.$parent && this.$parent.$emit('select-item-mounted',this);
    
    
    }
  }
  
  return HighOrderMixins;
}
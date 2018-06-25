import { affect } from '../../../../../.src/modules';

export default {
  props: ['value'],
  data : ()=>({ selected:false }),
  methods: {
    inheritValue (inherit){
      this.selected = this.value === null ? false : (this.value === inherit);
    },
    selectItem () {
      this.$parent && this.$parent.$emit('select-item-select-action',this.value);
      this.$emit('input',value);
    }
  },
  created (){
    const affectSelectedAttribute = affect(value=>{
      if(value){
        this.$el.setAttribute("selected","");
      } else {
        this.$el.removeAttibute("selected");
      }
    });
    
    this.$on("inherit-select-state",({ isSelectedValue })=>{
      affectSelectedAttribute(isSelectedValue(this.value))
    });
  },
  mounted (){
    this.$parent && this.$parent.$emit('select-item-mounted',this);
  }
}
import { Vue, Prop, Component, Inject } from 'nuxt-property-decorator';

export default ()=>{
  @Component({})
  class Option extends Vue {
    @Inject() parentComponent;
    @Prop() value:any;
    
    get isSelected (){
      const value = this.value;
      const parentComponent = this.parentComponent;
      if(!parentComponent) return false;
      const selected = parentComponent.selected;
      return selected === undefined ? false : (value === selected);
    }
    
    inheritedRequireClassed (){
      const parentComponent = this.parentComponent;
      if(!parentComponent) return [];
      let requireClassOfOption = parentComponent.requireClassOfOption;
      typeof requireClassOfOption === "function" && (requireClassOfOption = requireClassOfOption(this));
      return requireClassOfOption instanceof Array ? requireClassOfOption : [];
    }
  }
  return Option;
}

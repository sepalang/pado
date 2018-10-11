import { asArray } from '@sepalang/pado/functions';

export default function ({
  canMultiple = true
} = {}){
  //
  const HighOrderMixins = {
    props: (()=>{
      if(canMultiple){
        return ['multiple', 'selected'];
      } else {
        return ['selected'];
      }
    })(),
    model: {
      prop : 'selected',
      event: 'input'
    },
    data : ()=>({ SelectInterfaceMode: 'default' }),
    watch: {
      selected (selected){
        this.$children.forEach(selectItemVM=>selectItemVM.$emit('inherit-select-state', this.$inheritSelectState()));
      }
    },
    created (){
      const useMultiple = typeof this.multiple === 'string';

      this.$isSelectedValue = (selectValue)=>{
        return this.selected === undefined ? false : useMultiple ? asArray(this.selected).some(val=>val === selectValue) : this.selected === selectValue;
      };

      this.$inheritSelectState = ()=>{
        return { model: this.selected, isSelectedValue: this.$isSelectedValue };
      };

      //
      this.$on('select-item-select-action', item=>{
        if(typeof this.$el.getAttribute('disabled') === 'string') return;
        if(typeof this.$el.getAttribute('readOnly') === 'string') return;
        this.$emit('input', item);
      });

      //
      this.$on('select-item-mounted', selectItemVM=>selectItemVM.$emit('inherit-select-state', this.$inheritSelectState()));
    }
  };

  return HighOrderMixins;
}

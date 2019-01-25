<template>
  <ul class="nav nav-tabs">
    <slot></slot>
  </ul>
</template>
<script lang="ts">
import { mixins, Component } from 'nuxt-property-decorator';
import HighOrderSelect from './base/Select';

@Component({})
export default class NCTab extends mixins(HighOrderSelect()) {
  
  get requestRenderOption (){
    return (vm)=>{
      const vmValue = vm.value;
      const modelValue = this.model;
      const active = modelValue === vmValue;
      return {
        tag:"li",
        attrs:{ class:"nav-item" },
        childrens:[
          {
            tag:"a",
            class:{ active },
            slotEntry:true
          }
        ]
      }
    }
  }
  
}
</script>

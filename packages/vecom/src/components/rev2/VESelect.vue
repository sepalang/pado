<template>
  <div class="input-group" style="width:fit-content;">
    <span class="input-group-addon title" v-if="/string|number/.test(typeof title)">{{ title }}</span>
    <div
      class="dropdown ve-dropdown-toggle"
      ref="dropdownToggle" :class="{ show:dropdownShow }"
      :style="{ width:/string|number/.test(typeof title)?null:'100%' }"
    >
      <div class="input-group">
        <input type="text" class="form-control" :value="selectedLabelValue" placeholder="">
        <button 
          class="btn btn-m search"
          :class="[changeStyle?changeStyle:'line-2']" 
          :disabled="disabled"
          tabindex="-1"
        >
          <i class="icon-arrow-down"></i>
        </button>
      </div>
      <div class="dropdown-menu">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator';
import HighOrderSelect from './base/Select';
import _get from 'lodash/get';
import $ from 'jquery';

@Component({})
class NCSelect extends mixins(HighOrderSelect()) {
  
  dropdownShow:boolean = false;
  
  @Prop() title: any;
  @Prop() label: any;
  @Prop() equal: any;
  @Prop() placeholder: any;
  @Prop() invalid: any;
  @Prop() changeStyle: any;
  @Prop() disabled: boolean;
  @Prop() allowNull: any;
  
  isEqualValue (vmValue){
    const model = this.model;
    const equal = this.equal;
    
    if(model === undefined) return false;
    
    if(typeof equal === "string" || typeof equal === "number"){
      if(typeof vmValue !== "object" || !vmValue){
        return false;
      }
      
      return _get(model,equal) === _get(vmValue,equal);
    }
    
    return model === vmValue;
  }
  
  get requestRenderOption (){
    return (vm)=>{
      const vmValue = vm.value;
      const classed = ["dropdown-item"];
      
      this.isEqualValue(vmValue) && classed.push("selected");

      return {
        tag:"a",
        class:classed
      }
    }
  }
  
  get allowNullValue (){
    return typeof this.allowNull !== "undefined";
  }
  
  get selectedLabelValue(){
    const label = this.label;
    const model = this.model;
    const placeholder = this.placeholder;
    const allowNullValue = this.allowNullValue;
    const isNull = model === null;
    
    if(model || (allowNullValue && isNull)){
      if(label){
        if(typeof label === "function"){
          return label(model, model === null, placeholder);
        } else if(typeof label === "string" || typeof label === "number") {
          return _get(model,label);
        } else {
          return label;
        }
      } else {
        return model;
      }
    } else {
      return placeholder;
    }
  }
  
  created (){
    this.$on("beforeInput", ()=>{
      this.dropdownShow = false;
    });
  }
  
  mounted (){
    const $dropdownToggle = $(this.$refs.dropdownToggle);
    
    $dropdownToggle.onPointer(()=>this.dropdownShow = true,()=>this.dropdownShow === false)
    
    var $dropmenu = $dropdownToggle.next();
    var [dropmenu] = $dropmenu;

    $dropmenu.on('mousedown', e=>{
      e.preventDefault();
    })

    $dropmenu.on('mousewheel',e=>{
      //상위 스크롤을 멈추게 하는 로직
      let scrollTop = dropmenu.scrollTop;
      let scrollHeight = dropmenu.scrollHeight;
      let offsetHeight = dropmenu.offsetHeight;
      let scrollBottom = scrollTop + offsetHeight;

      //아래로 스크롤 가능할때
      if(scrollBottom < scrollHeight && e.deltaY < 0){
        e.stopPropagation();
      }

      //위 스크롤 가능할때
      if(scrollBottom > offsetHeight && e.deltaY > 0){
        e.stopPropagation();
      }

    });
    
    this['dropdownCancleHandler'] = (event)=>{
      const isContinasIn = $(this.$el).containsIn(event.target);
      
      if(!isContinasIn){
        this.dropdownShow = false;
      }
    };
    
    $(document).onPointer(this['dropdownCancleHandler'], ()=>this.dropdownShow === true)
  }
  
  destroy (){
    $(document).offPointer(this['dropdownCancleHandler']);
  }
}

export default NCSelect;
</script>

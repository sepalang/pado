<script lang="ts">
/*
  
<template>
  <a 
    href="javascript:;" 
    :class="thisClassed()" 
    @mousedown="clickItem(value)"
  >
    <slot></slot>
  </a>
</template>
  
*/
import { Component, mixins } from 'nuxt-property-decorator';
import HighOrderOption from './base/Option';
import { asArray } from '@/utils';

const renderOptionsToRenderArgs = ({ requestedElement, childrenMap=undefined })=>{
  const attrs = (()=>{
    const rootAttribute = requestedElement.attrs;
    const attributeKeys = Object.keys(rootAttribute||{});
    return attributeKeys.reduce((dest,key)=>{
      let attributeValue = rootAttribute[key];
      typeof attributeValue === "function" && (attributeValue = attributeValue(requestedElement));
      attributeValue !== undefined && attributeValue !== null && typeof attributeValue !== "function" && (dest[key] = attributeValue);
      return dest;
    },{});
  })();
  
  const { tag, on, childrens:requestedChildrens, class:classed, style } = requestedElement;
  const tagAttributes = { attrs, on, class:classed, style };
  
  //children
  let childParam = asArray(requestedChildrens);
  if(typeof childrenMap === "function"){
    childParam = childParam.map((childOption)=>childrenMap(childOption)).filter(v=>!!v);
  }
  
  //render args
  return [ tag, tagAttributes, childParam ];
}

const applySlots = (childrenArray:Array<any>,slots)=>{
  const { default:defaultSlot, head:headSlot, foot:footSlot } = slots;
  headSlot && childrenArray.push(headSlot);
  defaultSlot && childrenArray.push(defaultSlot);
  footSlot && childrenArray.push(footSlot);
  return childrenArray;
}

@Component({
  render (h){
    //slot
    const { $slots } = this;
    let slotProcessed = false;
    
    // request render option
    const requestedElement = this.requestedRenderPropertyBuilder(this);
    
    //
    const [ tag, tagAttributes, childrens ] = renderOptionsToRenderArgs({
      requestedElement,
      childrenMap:(child)=>{
        if(typeof child === "string") return h(child);
        if(!child || typeof child !== "object") return null;
      
        const { slotEntry:slotEntryFlag } = child;
        
        // yet support nested child
        const childChildrens = [];
      
        // change entrySlot
        if(slotProcessed === false && slotEntryFlag === true){
          slotProcessed = true;
          applySlots(childChildrens,$slots);
        }
      
        const [ childTag, childAttribute ] = renderOptionsToRenderArgs({ requestedElement:child });
        return h(childTag, childAttribute, childChildrens);
      }
    });
     
    if(slotProcessed === false){
      applySlots(childrens,$slots);
    }
    
    //slots
    return h(tag, tagAttributes, childrens);
  },
})
class NCOption extends mixins(HighOrderOption()) {
  
  get requestedRenderPropertyBuilder (){
    const baseOptionBuilder = (vm)=>({
      tag:"a",
      attrs:{
        href:({ tag })=> tag === 'a' ? "javascript:;" : null,
      },
      on: {
        mousedown:($event)=>vm.pointerStartItem({ $event, value:vm.value}),
      }
    });
    
    const parentComponent = this.parentComponent;
    if(!parentComponent || !parentComponent.requestRenderOption){
      return baseOptionBuilder;
    }
    
    let { requestRenderOption } = parentComponent;
    if(typeof requestRenderOption === "object"){
      const objectRenderOptions = requestRenderOption;
      requestRenderOption = ()=>objectRenderOptions;
    }
    
    if(typeof requestRenderOption !== "function"){
      console.error("requestRenderOption is must be object or function");
      return baseOptionBuilder;
    }
    
    return (vm)=>{
      const baseOptions = baseOptionBuilder(vm);
      const requestedElement = requestRenderOption(vm);
      
      !requestedElement.tag && (requestedElement.tag = baseOptions.tag);
      !requestedElement.attrs && (requestedElement.attrs = baseOptions.attrs);
      !requestedElement.on && (requestedElement.on = baseOptions.on);
      
      return requestedElement;
    }
  }
  
  pointerStartItem ({ $event, value }) {
    const parentComponent = this.parentComponent;
    parentComponent && parentComponent.$emit('ve-option-item-on-pointer-start',{ $event, value });
    this.$emit('input',value);
  }
  
}

export default NCOption;
</script>

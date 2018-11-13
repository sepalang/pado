<template>
  <div class="ve-panzoom" ref="rootElement" >
    <div ref="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { mapScreen } from '@sepalang/logic/web/screen';

export default {
  data:()=>({
    width:300,
    height:300
  }),
  computed: {
    bounds (){
      return {
        width:this.width,
        height:this.height
      }
    }
  },
  mounted (){
    const panzoom = mapScreen(this.$refs.rootElement,  {
      content:this.$refs.content,
      ...this.bounds
    });
  }
};
</script>

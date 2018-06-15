<template>
  <UsageLayout>
    <h1>DOMLine</h1>
    <div style="position:relative;">
      <pado-rect class="root-rect" size="40"></pado-rect>
      <pado-rect class="rect-right" size="40" left="100" top="100" dragmove></pado-rect>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  import PadoRect from '../component/pado-rect.vue';
  import { dragHelper, getElementBoundingRect } from '../../../../.src/web';
  import { rect, line, point } from '../../../../.src/modules';
  import $ from 'jquery';
  
  export default {
    components:{ UsageLayout, PadoSlider, PadoRect },
    data (){
      return {
        bounding:{},
        rectSize:40,
        x:0,
        y:0
      }
    },
    methods:{
      drawLine:function(){
        const $rootRect = $(this.$el).find(".root-rect");
        const $rectRight = $(this.$el).find(".rect-right");
        
        const rootBoundingRect = getElementBoundingRect($rootRect);
        const rightBoundingRect = getElementBoundingRect($rectRight);
        
        //console.log("rootBoundingRect",rootBoundingRect)
      }
    },
    mounted (){
      this.drawLine();
    }
  }
</script>
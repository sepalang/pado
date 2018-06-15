<template>
  <UsageLayout>
    <h1>DOMLine</h1>
    <div class="yaaa" style="position:relative;">
      <pado-rect class="root-rect" size="40" left="100" top="100"></pado-rect>
      <pado-rect class="rect-upside" size="40" left="100" top="0" @drawPoint="drawLine" dragmove></pado-rect>
      <pado-rect class="rect-upright" size="40" left="200" top="50" @drawPoint="drawLine" dragmove></pado-rect>
      <pado-rect class="rect-downright" size="40" left="150" top="150" @drawPoint="drawLine" dragmove></pado-rect>
      <pado-rect class="rect-downside" size="40" left="50" top="200" @drawPoint="drawLine" dragmove></pado-rect>
      <div class="path-placeholder"></div>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  import PadoRect from '../component/pado-rect.vue';
  import { dragHelper, getElementBoundingRect, makeSVG } from '../../../../.src/web';
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
        const rootBoundingRect    = getElementBoundingRect( $(this.$el).find(".root-rect") );
        const upsideBoundingRect  = getElementBoundingRect( $(this.$el).find(".rect-upside") );
        const uprightBoundingRect = getElementBoundingRect( $(this.$el).find(".rect-upright") );
        
        const downrightBoundingRect = getElementBoundingRect( $(this.$el).find(".rect-downright") );
        const downBoundingRect      = getElementBoundingRect( $(this.$el).find(".rect-downside") );
        
        const rootTopPoint    = rootBoundingRect.line("top").point("center");
        const rootBottomPoint = rootBoundingRect.line("bottom").point("center");
        const bottom2Points   = rootBottomPoint.pull(10).points(2);
        
        const svgTag = makeSVG()
        .addPath([rootTopPoint,upsideBoundingRect.line("bottom").point("center")])
        .addPath([rootTopPoint,uprightBoundingRect.line("left").point("center")])
        .addPath([bottom2Points[0],downBoundingRect.line("top").point("center")])
        .addPath([bottom2Points[1],downrightBoundingRect.line("left").point("center")])
        .createElement();
        $(this.$el).find(".path-placeholder").empty().append(svgTag);
      }
    },
    mounted (){
      this.drawLine();
    }
  }
</script>
<style lang="scss">
  .path-placeholder {
    position:absolute;
    top:0;
    left:0;
    pointer-events:none;
  }
</style>
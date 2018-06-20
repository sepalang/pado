<template>
  <UsageLayout>
    <h1>DOMLine</h1>
    <div class="yaaa" style="position:relative;">
      <PadoRect class="root-rect" size="40" left="100" top="100"></PadoRect>
      <PadoRect class="rect-upside" size="40" left="100" top="0" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-upright" size="40" left="200" top="50" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-downright" size="40" left="150" top="150" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-downside" size="40" left="50" top="200" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-angledown" size="40" left="200" top="200" @drawPoint="drawLine" dragmove></PadoRect>
      <div class="path-placeholder"></div>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/PadoSlider.vue';
  import PadoRect from '../component/PadoRect.vue';
  import { dragHelper, getElementBoundingRect, makeSVG } from '../../../../.src/web';
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
        const angleDownBoundingRect = getElementBoundingRect( $(this.$el).find(".rect-angledown") );
        
        const rootTopPoint    = rootBoundingRect.vertex("top").point("center");
        const rootBottomPoint = rootBoundingRect.vertex("bottom").point("center");
        const bottom2Points   = rootBottomPoint.pull(10);
        
        //rootTopPoint.vertex()
        const anglePath = bottom2Points
        .eq(1)
        .vertexWith(angleDownBoundingRect.findPoint("left center"))
        .join((first,last)=>first.rectWith(last).findPoint("left down"));
        
        const svgTag = makeSVG()
        .addPath([rootTopPoint,upsideBoundingRect.vertex("bottom").point("center")])
        .addPath([rootTopPoint,uprightBoundingRect.vertex("left").point("center")])
        .addPath([bottom2Points.eq(0),downBoundingRect.findPoint("top center")])
        .addPath([bottom2Points.eq(1),downrightBoundingRect.findPoint("left center")])
        .addPath(anglePath,{ "strokeWidth":2 , "stroke":"blue"})
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
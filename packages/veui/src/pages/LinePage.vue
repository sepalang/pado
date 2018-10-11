<template>
  <AppLayout>
    <div>LinePage</div>
    <div class="yaaa" style="position:relative;">
      <PadoRect class="root-rect" size="40" left="100" top="100"></PadoRect>
      <PadoRect class="rect-upside" size="40" left="100" top="0" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-upright" size="40" left="200" top="50" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-downright" size="40" left="150" top="150" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-downside" size="40" left="50" top="200" @drawPoint="drawLine" dragmove></PadoRect>
      <PadoRect class="rect-angledown" size="40" left="200" top="200" @drawPoint="drawLine" dragmove></PadoRect>
      <div class="path-placeholder"></div>
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import PadoRect from '@/components/PadoRect.vue';
import { getElementBoundingRect, makeSVG } from '../../../../../.src/web';

export default {
  components: {
    AppLayout,
    PadoRect
  },
  data (){
    return {
      bounding: {},
      rectSize: 40,
      x       : 0,
      y       : 0
    };
  },
  methods: {
    drawLine: function (){
      const rootBoundingRect    = getElementBoundingRect(this.$el.querySelector(".root-rect"));
      const upsideBoundingRect  = getElementBoundingRect(this.$el.querySelector(".rect-upside"));
      const uprightBoundingRect = getElementBoundingRect(this.$el.querySelector(".rect-upright"));
      
      const downrightBoundingRect = getElementBoundingRect(this.$el.querySelector(".rect-downright"));
      const downBoundingRect      = getElementBoundingRect(this.$el.querySelector(".rect-downside"));
      const angleDownBoundingRect = getElementBoundingRect(this.$el.querySelector(".rect-angledown"));
      
      const rootTopPoint    = rootBoundingRect.vertex("top").point("center");
      const rootBottomPoint = rootBoundingRect.vertex("bottom").point("center");
      const bottom2Points   = rootBottomPoint.pull(10);
      
      //rootTopPoint.vertex()
      const anglePath = bottom2Points
      .eq(1)
      .vertexWith(angleDownBoundingRect.findPoint("left center"))
      .join((first, last)=>first.rectWith(last).findPoint("left down"));
      
      const svgTag = makeSVG()
      .addPath([rootTopPoint, upsideBoundingRect.vertex("bottom").point("center")])
      .addPath([rootTopPoint, uprightBoundingRect.vertex("left").point("center")])
      .addPath([bottom2Points.eq(0), downBoundingRect.findPoint("top center")])
      .addPath([bottom2Points.eq(1), downrightBoundingRect.findPoint("left center")])
      .addPath(anglePath, { "strokeWidth": 2, "stroke": "blue"})
      .createElement();
      
      const placeholder = this.$el.querySelector(".path-placeholder");
      placeholder.innerHTML = "";
      placeholder.append(svgTag);
    }
  },
  mounted (){
    this.drawLine();
  }
};
</script>

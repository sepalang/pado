<template>
  <div class="v-layer" :style="layerStyle">
    <slot></slot>
  </div>
</template>
<script>
import HighOrderRect from '@sepalang/logic/vue/Rect';
import HighOrderPoint from '@sepalang/logic/vue/Point';

export default {
  mixins: [
    HighOrderRect([['width', 'height', 'size', 'rect'], ['auto', 'auto']]),
    HighOrderPoint([['left', 'top', 'point'], [0, 0]])
  ],
  props   : ["root", "opacity"],
  computed: {
    layerStyle (){
      const isRootLayer = typeof this.root !== "undefined";
      const layerStyle = isRootLayer ? {position: "relative"} : {position: "absolute"};
      
      const { width, height } = this.rectValue;
      const [left, top] = [this.left + 'px', this.top + 'px'];
      
      Object.assign(layerStyle, { width: width + 'px', height: height + 'px', left, top});
      
      if(/number|string/.test(typeof this.opacity)){
        layerStyle.opacity = parseFloat(this.opacity, 10);
      }
      return layerStyle;
    }
  },
  mounted (){

  }
};
</script>

<template>
  <div class="v-layer" :style="layerStyle">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props   : ["root", "opacity"],
  computed: {
    layerStyle (){
      let positionStyle = typeof this.root !== "undefined" ? "position:relative;" : "position:absolute;left:0px;top:0px;";
      if(/number|string/.test(typeof this.opacity)){
        positionStyle += `opacity:${parseFloat(this.opacity, 10)};`;
      }
      return positionStyle;
    }
  },
  mounted (){

  }
};
</script>

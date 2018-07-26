<template>
  <div class="v-point" :style="pointStyle">
    <div class="v-point-placeholder" :style="placeholderStyle">
      <slot></slot>
    </div>
    <div class="v-point-pointer" :style="pointerRectStyle" v-if="showPointer">
      <div class="v-point-ghost" :style="pointerRectStyle"></div>
      <div v-if="label" class="v-point-label" :style="{width:labelWidth+'px'}">{{label}}</div>
    </div>
  </div>
</template>
<script>
import HighOrderPoint from './mixins/HighOrderPoint';
export default {
  mixins: [ HighOrderPoint([['x', 'y', 'point'], [0, 0]]) ],
  props : {
    size      : {default: 5},
    label     : {},
    labelWidth: {default: 40},
    pointer   : {
      default: false
    },
    placement: {
      default: undefined
    }
  },
  computed: {
    showPointer (){
      return !!this.pointer || !this.placement;
    },
    pointStyle (){
      const { x, y } = this.pointStyleValue;
      console.log("this.pointStyleValue", this.pointStyleValue);
      return {left: x, top: y};
    },
    pointerRectStyle (){
      return {width: `${this.size}px`, height: `${this.size}px`};
    },
    labelValue (){
      return typeof this.label === 'string' ? this.label : undefined;
    },
    
    placeholderStyle (){
      const style = {};
      
      switch (this.placement){
        case "top": case "t":
          Object.assign(style, {
            position : "absolute",
            left     : "0px",
            top      : "0px",
            transform: "translate(-50%, -100%)"
          });
          break;
        case "middle": case "m":
        case "center": case "c":
        case "middle center": case "mc":
          Object.assign(style, {
            position : "absolute",
            left     : "0px",
            top      : "0px",
            transform: "translate(-50%, -50%)"
          });
          break;
        case "right bottom": case "rb":
          Object.assign(style, {
            position : "absolute",
            left     : "0px",
            top      : "0px",
            transform: "translate(0%, 0%)"
          });
          break;
      }
      
      return style;
    }
  }
};
</script>
<style lang="scss">
  $line-color:#67E2A4;
  .v-point {
    position:absolute;
    width:0px;
    height:0px;
    
    > .v-point-pointer {
      position:absolute;
      top:0px;
      left:0px;
      border-left:1px solid $line-color;
      border-top:1px solid $line-color;
      box-shadow: inset 2px 2px 2px rgba(0,0,0,.3);
      transform:translateZ(10000px);
    }
    
    .v-point-ghost {
      position:absolute;
      right:100%;
      bottom:100%;
      box-shadow: 2px 2px 2px rgba(0,0,0,.3);
      border-right:1px solid $line-color;
      border-bottom:1px solid $line-color;
    }
    
    .v-point-label {
      position:absolute;
      font-size:10px;
      top:0px;
      left:5px;
      color:#777;
    }
  }
</style>

<template>
  <div class="v-point" :style="pointStyle">
    <div class="v-point-ghost" :style="rectStyle"></div>
    <div v-if="label" class="v-point-label" :style="{width:labelWidth+'px'}">{{label}}</div>
  </div>
</template>
<script>
import HighOrderPoint from './mixins/HighOrderPoint';
export default {
  mixins:[ HighOrderPoint([["x","y","point"],[0,0]]) ],
  props:{
    size:{default:5},
    label:{},
    labelWidth:{default:40}
  },
  computed:{
    rectStyle (){
      return {width:`${this.size}px`,height:`${this.size}px`};
    },
    pointStyle (){
      const { x, y } = this.pointValue;
      return Object.assign({left:`${x}px`, top:`${y}px`},this.rectStyle);
    },
    labelValue (){
      return typeof this.label === "string" ? this.label : undefined;
    }
  }
}
</script>
<style lang="scss">
  $line-color:#67E2A4;
  .v-point {
    position:absolute;
    border-left:1px solid $line-color;
    border-top:1px solid $line-color;
    box-shadow: inset 2px 2px 2px rgba(0,0,0,.3);
    transform:translateZ(10000px);
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

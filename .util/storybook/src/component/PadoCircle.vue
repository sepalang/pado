<template>
  <span class="v-pado-circle" style="display:inline-block;" :style="{width:size,height:size}">
    <svg :width="size" :height="size">
      <path :d="dValue" :stroke-dasharray="dashArrayValue" :stroke-width="stroke" :stroke="value==0?'transparent':'#7AD1F8'" fill="transparent"></path>
    </svg>
  </span>
</template>
<script>
import $ from '../../../../.src/web/plugins/jquery';
import { dragHelper } from '../../../../.src/web/index';
import { domainRangeValue, drawCircleVars } from '../../../../.src/functions';

export default {
  props: {
    value:{
      default:0
    },
    maxValue:{
      default:100
    },
    minValue:{
      default:0
    },
    size:{
      default:50
    },
    stroke:{
      default:1
    }
  },
  computed:{
    dValue (){
      const { x, y, radius, diameter } = drawCircleVars(this.size, this.stroke);
      return `M${x} ${y} 
      a ${radius} ${radius} 0 0 1 0 ${diameter}
      a ${radius} ${radius} 0 0 1 0 -${diameter}`;
    },
    dashArrayValue (){
      const { circumference } = drawCircleVars(this.size, this.stroke);
      const circumferenceRatio = domainRangeValue([this.minValue,this.maxValue],[0,circumference],this.value);
      return `${circumferenceRatio}, ${circumference}`;
    }
  },
  data:()=>({
    showValue:"",
    rate:"",
  }),
  mounted (){
    
  },
  destroyed (){
    
  }
}
</script>
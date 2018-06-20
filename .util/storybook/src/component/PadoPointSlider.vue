<template>
  <div class="v-pado-xy-slider">
    <div class="v-pado-slider-scrollbar"></div>
    <div class="v-pado-slider-scroller"></div>
  </div>
</template>
<script>
import PadoSlider from '../component/PadoSlider.vue';
import $ from '../../../../.src/web/plugins/jquery';
import { dragHelper } from '../../../../.src/web';
import { limitOf, domainRangeValue } from '../../../../.src/functions';

export default {
  props: {
    value:{
      type:Object,
      default:()=>({x:50,y:50})
    },
    xMaxValue:{
      type:[String, Number],
      default:100
    },
    xMinValue:{
      type:[String, Number],
      default:0
    },
    yMaxValue:{
      type:[String, Number],
      default:100
    },
    yMinValue:{
      type:[String, Number],
      default:0
    },
    inputCycle:{
      default:"change"
    }
  },
  computed:{
    xValue (){
      return parseInt(this.value["x"],10);
    },
    yValue (){
      return parseInt(this.value["y"],10);
    },
    xMax(){
      return parseInt(this.xMaxValue,10);
    },
    xMin(){
      return parseInt(this.xMinValue,10);
    },
    yMax(){
      return parseInt(this.yMaxValue,10);
    },
    yMin(){
      return parseInt(this.yMinValue,10);
    },
    readOnly(){
      return typeof this.$el.getAttribute("readOnly") === "string";
    }
  },
  mounted (){
    const $element = $(this.$el);
    const $scrollbar = $element.find('.v-pado-slider-scrollbar');
    const $scroller  = $element.find('.v-pado-slider-scroller');
    
    this.$on("enter",({ x:xValue, y:yValue })=>{
      const xModelValue   = typeof xValue === "number" ? xValue : this.xValue;
      const yModelValue   = typeof yValue === "number" ? yValue : this.yValue;
      const barWidth     = $element.width()-$scroller.width();
      const barHeight    = $element.height()-$scroller.height();
      const leftPosition = domainRangeValue([this.xMin,this.xMax],[0,barWidth],xModelValue);
      const topPosition  = domainRangeValue([this.yMin,this.yMax],[0,barHeight],yModelValue);
      
      $scroller.css({
        "left":`${leftPosition}px`,
        "top":`${topPosition}px`
      });
    });
    
    (typeof this.xValue !== "undefined" || !this.xValue === 0) && this.$emit("enter",parseInt(this.xValue,10))
    
    this.$watch("value",(newValue)=>{
      this.$emit("enter",{
        x:this.xValue,
        y:this.yValue
      });
    });
    
    this.windowResizeHandle = ()=>{
      this.$emit("enter");
    };
    
    $(window).on("resize",this.windowResizeHandle);
    
    dragHelper(this.$el,({ element })=>{
      $scroller.css("pointer-events","none");
      let xFinalValue;
      let yFinalValue;
      return {
        "start, move":({ event })=>{
          if(this.readOnly){
            event.preventDefault();
          }
          
          let { left, width } = $scroller.predict({center:event}, element);
          const barWidth      = element.width() - width;
          const leftValue     = limitOf(left,barWidth);
          xFinalValue = Math.round(domainRangeValue([0, barWidth],[this.xMin,this.xMax],leftValue));
          
          let { top, height } = $scroller.predict({middle:event}, element);
          const barHeight     = element.height() - height;
          const topValue      = limitOf(top,barHeight);
          yFinalValue = Math.round(domainRangeValue([0, barHeight],[this.yMin,this.yMax],topValue));
          
          this.$emit("enter",{x:xFinalValue, y:yFinalValue});
          if(this.inputCycle === "enter"){
            this.$emit("input",{x:xFinalValue, y:yFinalValue});
          }
        },
        end:({ pointer })=>{
          this.$emit("input",{
            x:Math.round(typeof xFinalValue === "number" ? xFinalValue : this.xValue),
            y:Math.round(typeof yFinalValue === "number" ? yFinalValue : this.yValue)
          });
        }
      }
    });
  },
  destroyed (){
    $(window).off("resize",this.windowResizeHandle)
  }
}
</script>
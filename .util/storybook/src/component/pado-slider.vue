<template>
  <div class="pado-slider">
    <div class="pado-slider-scrollbar"></div>
    <div class="pado-slider-scroller"></div>
  </div>
</template>
<script>
import PadoSlider from '../component/pado-slider.vue';
import $ from '../../../../.src/dom/plugins/jquery';
import { dragHelper } from '../../../../.src/dom/index';
import { limitOf, domainRangeValue } from '../../../../.src/functions';


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
    }
  },
  computed:{
    bindValue (){
      return parseInt(this.value,10);
    },
    bindMaxValue(){
      return parseInt(this.maxValue,10);
    },
    bindMinValue(){
      return parseInt(this.minValue,10);
    }
  },
  mounted (){
    const $element = $(this.$el);
    const $scrollbar = $element.find('.pado-slider-scrollbar');
    const $scroller  = $element.find('.pado-slider-scroller');
    
    this.$on("drawInput",(value)=>{
      const modelValue   = typeof value === "number" ? value : this.bindValue;
      const barLength    = $scrollbar.width()-$scroller.width();
      const leftPosition = domainRangeValue([this.bindMinValue,this.bindMaxValue],[0,barLength],modelValue);
      $scroller.css("left",leftPosition);
    });
    
    (typeof this.bindValue !== "undefined" || !this.bindValue === 0) && this.$emit("drawInput",parseInt(this.bindValue,10))
    
    this.$watch("value",(newValue)=>{
      this.$emit("drawInput",newValue);
    });
    
    this.windowResizeHandle = ()=>{
      this.$emit("drawInput");
    };
    
    $(window).on("resize",this.windowResizeHandle);
    
    dragHelper($scrollbar,({ element })=>{
      $scroller.css("pointer-events","none");
      let finalValue;
      return {
        "start, move":({ event })=>{
          let { left, width } = $scroller.predict({center:event}, element);
          const barLength     = element.width() - width;
          const leftValue     = limitOf(left,barLength);
          finalValue = domainRangeValue([0, barLength],[this.bindMinValue,this.bindMaxValue],leftValue);
          this.$emit("drawInput",Math.round(finalValue));
        },
        end:({ pointer })=>{
          const endValue = Math.round(typeof finalValue === "number" ? finalValue : this.bindValue);
          this.$emit("input",endValue);
        }
      }
    });
  },
  destroyed (){
    $(window).off("resize",this.windowResizeHandle)
  }
}
</script>
<template>
  <div class="v-pado-slider">
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
    },
    readOnly(){
      return typeof this.$el.getAttribute("readOnly") === "string";
    }
  },
  mounted (){
    const $element = $(this.$el);
    const $scrollbar = $element.find('.v-pado-slider-scrollbar');
    const $scroller  = $element.find('.v-pado-slider-scroller');
    
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
          if(this.readOnly){
            event.preventDefault();
          }
          
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
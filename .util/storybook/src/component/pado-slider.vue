<template>
  <div class="pado-slider">
    {{ showValue }}
    <div class="pado-slider-scrollbar"></div>
    <div class="pado-slider-scroller"></div>
  </div>
</template>
<script>
import PadoSlider from '../component/pado-slider.vue';
import $ from '../../../../.src/dom/plugins/jquery';
import { dragHelper } from '../../../../.src/dom/index';
import { domainRangeValue } from '../../../../.src/functions';

export default {
  props: {
    
  },
  created (){
    
  },
  data:()=>({
    showValue:"NaN"
  }),
  mounted (){
    const $element = $(this.$el);
    const $scrollbar = $element.find('.pado-slider-scrollbar');
    const $scroller  = $element.find('.pado-slider-scroller');
    
    this.$on("draw",()=>{
      var scrollSize  = ~~((bodyScreen.offsetHeight / bodyScreen.scrollHeight) * bodyScreen.offsetHeight);
      var scrollPoint = domainRangeValue([0,bodyScreen.scrollHeight],[0,bodyScreen.offsetHeight],bodyScreen.scrollTop,true);
      $scroller.css({
          top:scrollerTop + "px",
          height:scrollerHeight + "px"
      });
    });
    
    $scrollbar.on("mousedown",function(e){
      const b = $scroller.predict("center",e);
      console.log("b",b);
    });
    
    
    dragHelper($scroller,()=>{
      return {
        start:({ pointer })=>{
          
          
        },
        move:({ pointer:{ left, leftValue } })=>{
          $scroller.css("left",left);
          this.showValue = left;
        },
        end:({ pointer })=>{
          console.log("pointer",pointer);
        }
      }
    })
    
  }
}
</script>
<template>
  <div class="pado-slider">
    <div class="pado-slider-scrollbar"></div>
    <div class="pado-slider-scroller"></div>
    <br><br>
    <div>
      {{ rate }}
    </div>
    <div>
      {{ showValue }}
    </div>
  </div>
</template>
<script>
import PadoSlider from '../component/pado-slider.vue';
import $ from '../../../../.src/dom/plugins/jquery';
import { dragHelper } from '../../../../.src/dom/index';
import { limitOf, domainRangeValue } from '../../../../.src/functions';


export default {
  props: {
    
  },
  created (){
    
  },
  data:()=>({
    showValue:"",
    rate:"",
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
    
    dragHelper($scrollbar,({ element, delegate })=>{
      
      delegate($scroller);
      
      return {
        "start, move":({ event })=>{
          let { left, width } = $scroller.predict({center:event}, element);
          
          const scrollbarRight = element.width() - width;
          const limitedValue   = limitOf(left,scrollbarRight);
          
          $scroller.css("left",limitedValue);
          
          this.showValue = { limitedValue, left, width };
          this.rate = domainRangeValue([0, scrollbarRight],[0,100],limitedValue);
        },
        end:({ pointer })=>{
          console.log("pointer",pointer);
        }
      }
    })
    
  }
}
</script>
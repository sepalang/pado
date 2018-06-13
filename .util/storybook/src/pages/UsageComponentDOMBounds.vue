<template>
  <UsageLayout>
    <h1>DOMBounds</h1>
    <div>
      <div>
        size
        <pado-slider style="width:200px;"></pado-slider>  
      </div>
      <div>
        y
        <pado-slider style="width:200px;"></pado-slider>  
      </div>
      <div>
        z
        <pado-slider style="width:200px;"></pado-slider>  
      </div>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  import PadoRect from '../component/pado-rect.vue';
  import { rect, line, point } from '../../../../.src/modules';
  
  export default {
    components:{ UsageLayout, PadoSlider, PadoRect },
    data (){
      return {
        repeatCount:2,
        circleValue:80
      }
    },
    computed:{
      
    }
  }
</script>
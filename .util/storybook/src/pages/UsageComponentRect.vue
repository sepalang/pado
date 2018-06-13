<template>
  <UsageLayout>
    <h1>Rect</h1>
    <div>
      <pado-slider v-model="rectSize" min-value="20" max-value="800" style="width:150px"></pado-slider> {{ rectSize }}
    </div>
    <div>
      <pado-rect v-model="circleValue" :size="rectSize"></pado-rect>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  import PadoRect from '../component/pado-rect.vue';
  import { times } from '../../../../.src/functions';
  
  export default {
    components:{ UsageLayout, PadoSlider, PadoRect },
    data (){
      return {
        rectSize:20
      }
    },
    computed:{
      repeatCircles (){
        return times(this.repeatCount,i=>i);
      }
    }
  }
</script>
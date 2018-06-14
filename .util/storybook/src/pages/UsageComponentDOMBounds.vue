<template>
  <UsageLayout>
    <h1>DOMBounds</h1>
    <div>
      <div>
        size
        <pado-slider v-model="rectSize" min-value="40" max-value="400" style="width:200px;"></pado-slider> {{rectSize}}
      </div>
      <div>
        x
        <pado-slider v-model="x" style="width:200px;"></pado-slider> {{x}}
      </div>
      <div>
        y
        <pado-slider v-model="y" style="width:200px;"></pado-slider> {{y}}
      </div>
    </div>
    <div>
      Bounding = {{ bounding }}
    </div>
    <div style="poisition:relative;">
      <pado-rect :size="rectSize" :left="x" :top="y" @bounding="bounding = $event"></pado-rect>
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
        bounding:{},
        rectSize:40,
        x:0,
        y:0
      }
    },
    computed:{
      
    }
  }
</script>
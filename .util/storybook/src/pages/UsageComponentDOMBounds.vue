<template>
  <UsageLayout>
    <h1>DOMBounds</h1>
    <div>
      <div>
        size
        <PadoSlider v-model="rectSize" min-value="40" max-value="400" style="width:200px;"></PadoSlider> {{rectSize}}
      </div>
      <div>
        x
        <PadoSlider v-model="x" style="width:200px;"></PadoSlider> {{x}}
      </div>
      <div>
        y
        <PadoSlider v-model="y" style="width:200px;"></PadoSlider> {{y}}
      </div>
    </div>
    <div>
      Bounding = {{ bounding }}
    </div>
    <div class="recw" style="position:relative;">
      <PadoRect :size="rectSize" :left="x" :top="y" @bounding="bounding = $event"></PadoRect>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/PadoSlider.vue';
  import PadoRect from '../component/PadoRect.vue';
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
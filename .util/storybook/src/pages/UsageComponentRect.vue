<template>
  <UsageLayout>
    <h1>Rect</h1>
    <div>
      <PadoSlider v-model="rectSize" min-value="20" max-value="800" style="width:150px"></PadoSlider> {{ rectSize }}
    </div>
    <div>
      <PadoRect :size="rectSize"></PadoRect>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/PadoSlider.vue';
  import PadoRect from '../component/PadoRect.vue';
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
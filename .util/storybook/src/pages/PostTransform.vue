<template>
  <AppLayout>
    <div>PostTransform</div>
    
    <section>
      <PadoRect size="150" :style="{transform:boxTransform01,opacity:.7,'pointer-events':none}"></PadoRect>
      <br>
      rotateX <PadoSlider v-model="box01.rotateX" min-value="-100" style="width:200px;"></PadoSlider> {{ box01.rotateX }}
      <br>
      rotateY <PadoSlider v-model="box01.rotateY" min-value="-100" style="width:200px;"></PadoSlider> {{ box01.rotateY }}
      <br>
      perspective <PadoSlider v-model="box01.perspective" min-value="100" max-value="700" style="width:200px;"></PadoSlider> {{ box01.perspective }}
    </section>
    
  </AppLayout>
</template>
<script>
import AppLayout from "../layout/AppLayout.vue";
import PadoRect from '../component/pado-rect.vue';
import PadoSlider from '../component/pado-slider.vue';
import { transformVariant } from '../../../../.src/web';

export default {
  components:{
    AppLayout,
    PadoRect,
    PadoSlider
  },
  computed:{
    boxTransform01 (){
      return transformVariant(this.box01);
    }
  },
  data (){
    return {
      box01:{ rotateX:0, rotateY:0, perspective:400 }
    }
  }
}
</script>
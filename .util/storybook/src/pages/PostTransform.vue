<template>
  <AppLayout>
    <div>PostTransform</div>
    <section>
      <layer class="no-pointer-events">
        <PadoRect size="150" :style="{transform:boxTransform01,opacity:.7,'pointer-events':none}"></PadoRect>
      </layer>
      <layer class="no-pointer-events">
        <PadoRect size="150" theme="frame"></PadoRect>
        <PadoPoint x="0" y="0"></PadoPoint>
      </layer>
      <div style="min-height:150px;"></div>
      <br>
      <div class="no-word-break">{{ boxTransform01 }}</div>
      <br>
      rotateX <PadoSlider v-model="box01.rotateX" input-cycle="enter" min-value="-360" max-value="360" style="width:200px;"></PadoSlider> {{ box01.rotateX }}
      <br>
      rotateY <PadoSlider v-model="box01.rotateY" input-cycle="enter" min-value="-360" max-value="360" style="width:200px;"></PadoSlider> {{ box01.rotateY }}
      <br>
      perspective <PadoSlider v-model="box01.perspective" input-cycle="enter" min-value="100" max-value="500" style="width:200px;"></PadoSlider> {{ box01.perspective }}
      <br>
      perspective-origin
      <PadoGraphSlider></PadoGraphSlider>
    </section>
    
  </AppLayout>
</template>
<script>
import AppLayout from "../layout/AppLayout.vue";
import { Layer, PadoRect, PadoSlider } from '../component';
import { transformVariant } from '../../../../.src/web';

export default {
  components:{
    AppLayout,
    Layer,
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
      box01:{ rotateX:0, rotateY:0, perspective:300 }
    }
  }
}
</script>
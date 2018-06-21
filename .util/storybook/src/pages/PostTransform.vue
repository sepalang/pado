<template>
  <AppLayout>
    <div>PostTransform</div>
    <section>
      <layer class="no-pointer-events">
        <PadoRect size="150" label="transform" :style="boxTransform01"></PadoRect>
      </layer>
      <layer class="no-pointer-events">
        <PadoRect size="150" label="" theme="frame"></PadoRect>
        <PadoPoint :x="box01.perspectiveOrigin.x" :y="box01.perspectiveOrigin.y" label="perspective-origin" style="opacity:.4"></PadoPoint>
      </layer>
      <div style="min-height:170px;"></div>
      <div class="no-word-break"></div>
      <table style="width:600px;">
        <colgroup>
          <col style="width:120px">
          <col>
          <col style="width:55px">
        </colgroup>
        <tbody>
          <tr>
            <th>rotateX</th>
            <td><PadoSlider v-model="box01.rotateX" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
            <td>{{box01.rotateX}}</td>
          </tr>
          <tr>
            <th>rotateY</th>
            <td><PadoSlider v-model="box01.rotateY" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
            <td>{{box01.rotateY}}</td>
          </tr>
          <tr>
            <th>perspective</th>
            <td><PadoSlider v-model="box01.perspective" input-cycle="enter" min-value="100" max-value="500"></PadoSlider></td>
            <td>{{box01.perspective}}</td>
          </tr>
          <tr>
            <th colspan="3">
              <PadoPointSlider 
                v-model="box01.perspectiveOrigin"
                input-cycle="enter"
                x-max-value="150"
                y-max-value="150"
              ></PadoPointSlider>
            </th>
          </tr>
        </tbody>
      </table>
    </section>
    
  </AppLayout>
</template>
<script>
import AppLayout from "../layout/AppLayout.vue";
import { Layer, PadoRect, PadoSlider, PadoPoint, PadoPointSlider } from '../component';
import { matrix } from '../../../../.src/functions';
import { transformVariant } from '../../../../.src/web';

export default {
  components:{
    AppLayout,
    Layer,
    PadoPoint,
    PadoRect,
    PadoSlider,
    PadoPointSlider
  },
  computed:{
    boxTransform01 (){
      return { 
        transform: transformVariant(this.box01), 
        opacity:.7
      };
    }
  },
  data (){
    return {
      box01:{ rotateX:0, rotateY:0, perspective:300, perspectiveOrigin:{x:75,y:75} }
    }
  }
}
</script>
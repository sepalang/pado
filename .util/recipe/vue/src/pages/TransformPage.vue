<template>
  <AppLayout>
    <div>PostTransform</div>
    <section>
      <layer class="no-pointer-events" :style="{left:`${box01MoveDistance}px`}">
        <PadoRect class="box01" size="150" label="transform" :style="boxTransform01"></PadoRect>
      </layer>
      <layer class="no-pointer-events">
        <PadoRect size="150" label="" theme="frame"></PadoRect>
      </layer>
      <layer class="no-pointer-events">
        <PadoPoint
          v-for="vertex in box01VertexTransform"
          :key="vertex.key"
          :x="vertex.x"
          :y="vertex.y"
          :label="vertex.key"
        >
          비
        </PadoPoint>
      </layer>
      <layer class="no-pointer-events" >
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
            <th>rotateZ</th>
            <td><PadoSlider v-model="box01.rotateZ" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
            <td>{{box01.rotateZ}}</td>
          </tr>
          <tr>
            <th>perspective</th>
            <td><PadoSlider v-model="box01.perspective" input-cycle="enter" min-value="0" max-value="500"></PadoSlider></td>
            <td>{{box01.perspective}}</td>
          </tr>
          <tr v-for="(vertex, index) in box01VertexTransform" :key="index">
            <td>Point {{ index }}</td>
            <td>x : {{ vertex.x }}, y : {{ vertex.y }}</td>
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
          <tr>
            <th>target move</th>
            <td><PadoSlider v-model="box01MoveDistance" input-cycle="enter" min-value="0" max-value="500"></PadoSlider></td>
            <td>{{box01MoveDistance}}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import { Layer, PadoRect, PadoSlider, PadoPoint, PadoPointSlider } from '../components';
import {
  transformVariant,
  getElementBoundingRect,
  getElementTransformMatrix
} from '../../../../../.src/web';
import { nextTick } from '../service';

export default {
  components: {
    AppLayout,
    Layer,
    PadoPoint,
    PadoRect,
    PadoSlider,
    PadoPointSlider
  },
  computed: {
    boxTransform01 (){
      return {
        transform: transformVariant(this.box01),
        opacity  : 0.7
      };
    },
    box01Element (){
      return this.$el.querySelectorAll('.box01')[0];
    },
    $drawVertexHandle (){
      return [this.box01, this.box01.rotateX, this.box01.rotateY] &&
      this.$el &&
      this.drawVertex();
    }
  },
  watch: {
    $drawVertexHandle (){}
  },
  methods: {
    drawVertex (){
      const box01 = this.$el.querySelectorAll('.box01')[0];
      const perspectiveOrigin = getElementBoundingRect(box01).findPoint('center');
      const box01VertexOriginal = getElementBoundingRect(box01).vertex();
      const transformMatrix = getElementTransformMatrix(box01);

      this.box01VertexTransform = box01VertexOriginal.map((vertex, index)=>{
        return Object.assign(
          vertex.addMatrix(transformMatrix, perspectiveOrigin, 400).toJSON(),
          { key: index }
        );
      });
    }
  },
  data (){
    return {
      box01: { 
        rotateX          : 0, 
        rotateY          : 0,
        rotateZ          : 0,
        perspective      : 0, 
        perspectiveOrigin: {x: 75, y: 75} 
      },
      box01VertexOriginal : [],
      box01VertexTransform: [],
      box01MoveDistance   : 0
    };
  },
  mounted (){
    nextTick(()=>{
      console.log(this.$el);
      this.drawVertex();
    });
  }
};
</script>

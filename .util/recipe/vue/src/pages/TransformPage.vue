<template>
  <AppLayout>
    <div>Affine</div>
    <section>
      <layer class="no-pointer-events" :style="{left:`${boxMoveDistance}px`}">
        <PadoRect ref="box" class="box" size="150" label="transform" :style="transformedBoxStyle"></PadoRect>
      </layer>
      <layer v-if="boxBoundingRect.width">
        <PadoRect
          theme="frame"
          :left="boxBoundingRect.left"
          :top="boxBoundingRect.top"
          :width="boxBoundingRect.width"
          :height="boxBoundingRect.height"
        >
        </PadoRect>
      </layer>
      <layer class="no-pointer-events">
        <PadoRect size="150" label="" theme="frame"></PadoRect>
      </layer>
      <layer class="no-pointer-events">
        <PadoPoint
          v-for="(vertex, index) in boxVertexPointArray"
          :key="index"
          :x="vertex.x"
          :y="vertex.y"
          :label="vertex.key"
        >
          v{{ index }}
        </PadoPoint>
      </layer>
      <layer class="no-pointer-events" >
        <PadoPoint :x="perspectiveOrigin.x" :y="perspectiveOrigin.y" label="perspective-origin" style="opacity:.4"></PadoPoint>
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
            <td><PadoSlider v-model="rotateX" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
            <td>{{rotateX}}</td>
          </tr>
          <tr>
            <th>rotateY</th>
            <td><PadoSlider v-model="rotateY" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
            <td>{{rotateY}}</td>
          </tr>
          <tr>
            <th>rotateZ</th>
            <td><PadoSlider v-model="rotateZ" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
            <td>{{rotateZ}}</td>
          </tr>
          <tr>
            <th>perspective</th>
            <td><PadoSlider v-model="perspective" input-cycle="enter" min-value="0" max-value="500"></PadoSlider></td>
            <td>{{perspective}}</td>
          </tr>
          <tr v-for="(vertex, index) in boxVertexPointArray" :key="index">
            <td>Point {{ index }}</td>
            <td>x : {{ vertex.x }}, y : {{ vertex.y }}</td>
          </tr>
          <tr v-if="boxTransformMatrix">
            <td colspan="2">
              <div>{{ boxTransformMatrix }}</div>
              <div>{{ boxTransformVariant }}</div>
            </td>
          </tr>
          <tr>
            <th colspan="3">
              <PadoPointSlider
                v-model="perspectiveOrigin"
                input-cycle="enter"
                x-max-value="150"
                y-max-value="150"
              ></PadoPointSlider>
            </th>
          </tr>
          <tr>
            <th>target move</th>
            <td><PadoSlider v-model="boxMoveDistance" input-cycle="enter" min-value="0" max-value="500"></PadoSlider></td>
            <td>{{boxMoveDistance}}</td>
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
  getElementOffsetRect,
  getElementBoundingRect,
  getElementTransformMatrix,
  getElementTransform
} from '../../../../../.src/web';

import {
  rect
} from '../../../../../.src/modules';

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
    transformedBoxStyle (){
      return {
        transform: transformVariant({
          perspectiveOrigin: this.perspectiveOrigin,
          perspective      : this.perspective,
          rotateZ          : this.rotateZ,
          rotateY          : this.rotateY,
          rotateX          : this.rotateX
        }),
        opacity: 0.7
      };
    },
    boxTransformMatrix (){
      const [ box ] = [this.$refs.box && this.$refs.box.$el, this.transformedBoxStyle];
      return box ? getElementTransformMatrix(box) : undefined;
    },
    boxTransformVariant (){
      const [ box ] = [this.$refs.box && this.$refs.box.$el, this.transformedBoxStyle];
      return box ? getElementTransform(box) : undefined;
    },
    boxBoundingRect (){
      const [ box ] = [this.$refs.box && this.$refs.box.$el, this.transformedBoxStyle];
      return box ? getElementBoundingRect(box) : rect();
    },
    boxElement (){
      return this.$el.querySelectorAll('.box')[0];
    },
    boxVertexPointArray (){
      const transformMatrix = this.boxTransformMatrix;
      const perspective = this.perspective;
      
      const box = this.$refs.box && this.$refs.box.$el;
      if(!box) return [];
      
      const boxRect = getElementOffsetRect(box);
      boxRect.meta = { perspective };
      
      return boxRect.vertex().map((vertex, index)=>{
        return transformMatrix ? vertex.multiflyMatrix(transformMatrix) : vertex;
      });
    }
  },
  data (){
    return {
      rotateX          : 0, 
      rotateY          : 0,
      rotateZ          : 0,
      perspective      : undefined,
      perspectiveOrigin: {x: 75, y: 75},
      boxMoveDistance  : 0
    };
  },
  mounted (){
    nextTick(()=>{
      this.boxVertexPointArray.toString();
      this.perspective = 0;
    });
  }
};
</script>

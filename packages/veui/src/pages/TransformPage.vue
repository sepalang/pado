<template>
  <AppLayout>
    <div>Affine</div>
    <section>
      <layer class="no-pointer-events" :style="{left:`${boxMoveDistance}px`}">
        <PadoRect ref="box" class="box" :size="boxSize" label="transform" :style="transformedBoxStyle"></PadoRect>
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
      <table style="width:900px;">
        <tbody>
          <tr>
            <td style="vertical-align:top;">
              <table>
                <colgroup>
                  <col style="width:110px">
                  <col>
                  <col style="width:65px">
                </colgroup>
                <tbody>
                  <tr>
                    <th>rotateX</th>
                    <td><PadoSlider v-model="rotateX" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
                    <td><a @click="rotateX+=1">u</a><a @click="rotateX-=1">d</a> {{rotateX}}</td>
                  </tr>
                  <tr>
                    <th>rotateY</th>
                    <td><PadoSlider v-model="rotateY" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
                    <td><a @click="rotateY+=1">u</a><a @click="rotateY-=1">d</a> {{rotateY}}</td>
                  </tr>
                  <tr>
                    <th>rotateZ</th>
                    <td><PadoSlider v-model="rotateZ" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
                    <td><a @click="rotateZ+=1">u</a><a @click="rotateZ-=1">d</a> {{rotateZ}}</td>
                  </tr>
                  <tr>
                    <th>translateX</th>
                    <td><PadoSlider v-model="translateX" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
                    <td>{{translateX}}</td>
                  </tr>
                  <tr>
                    <th>translateY</th>
                    <td><PadoSlider v-model="translateY" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
                    <td>{{translateY}}</td>
                  </tr>
                  <tr>
                    <th>translateZ</th>
                    <td><PadoSlider v-model="translateZ" input-cycle="enter" min-value="-360" max-value="360"></PadoSlider></td>
                    <td>{{translateZ}}</td>
                  </tr>
                  <tr>
                    <th>scaleX</th>
                    <td><PadoSlider v-model="scaleX" input-cycle="enter" min-value="-1" max-value="3"></PadoSlider></td>
                    <td>{{scaleX}}</td>
                  </tr>
                  <tr>
                    <th>scaleY</th>
                    <td><PadoSlider v-model="scaleY" input-cycle="enter" min-value="-1" max-value="3"></PadoSlider></td>
                    <td>{{scaleY}}</td>
                  </tr>
                  <tr>
                    <th>scaleZ</th>
                    <td><PadoSlider v-model="scaleZ" input-cycle="enter" min-value="-1" max-value="3"></PadoSlider></td>
                    <td>{{scaleZ}}</td>
                  </tr>
                  <tr>
                    <th>perspective</th>
                    <td><PadoSlider v-model="perspective" input-cycle="enter" min-value="0" max-value="500"></PadoSlider></td>
                    <td>{{perspective}}</td>
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
            </td>
            <td style="vertical-align:top;">
              <table>
                <colgroup>
                  <col style="width:110px">
                  <col>
                </colgroup>
                <tbody>
                  <tr>
                    <th>computed<br>matrix</th>
                    <td>
                      {{transfomedComputedMatrix}}
                    </td>
                  </tr>
                  <tr>
                    <th>element<br>matrix</th>
                    <td>
                      {{boxTransformMatrix}}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      
                    </td>
                    <td>
                      <pre>{{boxTransformVariant}}</pre>
                    </td>
                  </tr>
                  <tr v-for="(vertex, index) in boxVertexPointArray" :key="index">
                    <td>Point {{ index }}</td>
                    <td>x : {{ vertex.x }}, y : {{ vertex.y }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
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
  transformStyleVariant,
  transformMatrixVariant,
  getElementOffsetRect,
  getElementBoundingRect,
  getElementTransformMatrix,
  getElementTransform
} from '@sepalang/pado/web';

import {
  rect
} from '@sepalang/pado/modules';

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
    perspectiveOrigin (){
      [this.boxSize].includes();
      return {x: 0, y: 0} && {x: this.boxSize / 2, y: this.boxSize / 2};
    },
    transformedBoxStyle (){
      const boxSize = this.boxSize;
      let {x:left, y:top} = this.perspectiveOrigin;
      left = `${left / boxSize * 100}%`;
      top = `${top / boxSize * 100}%`;
      
      return {
        transform           : transformStyleVariant(this),
        'perspective-origin': `${left} ${top}`,
        opacity             : 0.7
      };
    },
    transfomedComputedMatrix (){
      return transformMatrixVariant(this);
    },
    boxTransformMatrix (){
      [this.transformedBoxStyle].includes();
      const box = this.$refs.box && this.$refs.box.$el;
      return box ? getElementTransformMatrix(box) : undefined;
    },
    boxTransformVariant (){
      [this.transformedBoxStyle].includes();
      const box = this.$refs.box && this.$refs.box.$el;
      return box ? getElementTransform(box) : undefined;
    },
    boxBoundingRect (){
      [this.transformedBoxStyle].includes();
      const box = this.$refs.box && this.$refs.box.$el;
      return box ? getElementBoundingRect(box) : rect();
    },
    boxElement (){
      return this.$el.querySelectorAll('.box')[0];
    },
    boxVertexPointArray (){
      const box = this.$refs.box && this.$refs.box.$el;
      const transformMatrix = this.transfomedComputedMatrix;
      const perspective = this.perspective;
      const perspectiveOrigin = this.perspectiveOrigin;
      
      if(!box) return [];
      
      const boxRect = getElementOffsetRect(box);
      boxRect.meta = { 
        perspective,
        perspectiveOrigin
      };
      
      return boxRect.vertex().map((vertex, index)=>{
        return transformMatrix ? vertex.applyTransform(transformMatrix) : vertex;
      });
    }
  },
  data (){
    return {
      boxSize        : 150,
      rotateX        : 0, 
      rotateY        : 0,
      rotateZ        : 0,
      translateX     : 0, 
      translateY     : 0,
      translateZ     : 0,
      scaleX         : 1, 
      scaleY         : 1,
      scaleZ         : 1,
      perspective    : undefined,
      boxMoveDistance: 0
    };
  },
  mounted (){
    this.isMounted = true;
    this.boxVertexPointArray.toString();
    this.perspective = 0;
  }
};
</script>

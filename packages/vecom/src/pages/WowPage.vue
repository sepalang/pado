<template>
  <AppLayout style="width:600px ">
    <div>WowPage</div>
    <table class="form-table">
      <tbody>
        <tr>
          <th></th>
          <th></th>
          <th>minimap</th>
        </tr>
        <tr>
          <td></td>
          <td>
            <input type="text" v-model.number="rotateX" style="width:100%">
            <input type="text" v-model.number="rotateY" style="width:100%">
            <input type="text" v-model.number="rotateZ" style="width:100%">
          </td>
          <td></td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td colspan="3">
            <PadoScreen ref="main" style="width:100%;height:200px;">
              <div :style="outsideStyle">
                <div :style="mainRectStyle" ref="mainRect"></div>
                <VEPoint 
                  v-for="(point, index) in gridPoints"
                  :key="index"
                  :x="point.x"
                  :y="point.y"
                >
                </VEPoint>
              </div>
            </PadoScreen>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <PadoScreen ref="main" style="width:100%;height:200px;">
              <div :style="outsideStyle">
                <div :style="mainRectStyle" ref="mainRect"></div>
                <VEPoint 
                  v-for="(point, index) in gridPoints2"
                  :key="index"
                  :x="point.x"
                  :y="point.y"
                >
                </VEPoint>
              </div>
            </PadoScreen>
          </td>
        </tr>
      </tbody>
    </table>
    <div> main rect </div>
    {{ mainRectStyle }}
    <div> outside </div>
    {{ outSide }}
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import VERect from '@/components/VERect.vue';
import PadoScreen from '@/components/PadoScreen.vue';
import PadoMinimap from '@/components/PadoMinimap.vue';
import VEPoint from '@/components/VEPoint.vue';
import { rect } from '@sepalang/pado/modules/stance';
import {
  transformStyleVariant,
  transformMatrixVariant,
  //getElementOffsetRect,
  //getElementBoundingRect,
  getElementTransformMatrix,
  getElementTransform
} from '@sepalang/logic/web';

export default {
  components: {
    AppLayout,
    VERect,
    PadoScreen,
    PadoMinimap,
    VEPoint
  },
  data: ()=>({
    gridSize  : 50,
    column    : 5,
    row       : 5,
    rotateX   : 30,
    rotateY   : 0,
    rotateZ   : 10,
    gridPoints: [],
    gridPoints2: [],
    outSide   : {
      width : 0,
      height: 0
    }
  }),
  computed: {
    mainRectSize (){
      return {
        width : this.column * this.gridSize,
        height: this.row * this.gridSize
      };
    },
    outsideStyle (){
      return {
        border   : '1px solid red',
        width    : `${this.mainRectSize.width + this.outSide.width}px`,
        height   : `${this.mainRectSize.height + this.outSide.height}px`,
        transform: `translate(${-this.outSide.left}px, ${-this.outSide.top}px)`
      };
    },
    mainRectStyle (){
      const { width, height } = this.mainRectSize;
      return {
        width    : `${width}px`,
        height   : `${height}px`,
        border   : '1px solid blue',
        transform: transformStyleVariant({
          rotateZ: this.rotateZ,
          rotateY: this.rotateY,
          rotateX: this.rotateX
        })
      };
    }
  },
  methods: {
    mainDraw (){
      const { width, height } = this.mainRectSize;
      const matrix = transformMatrixVariant(this);
      const pointFrame = rect(0, 0, width, height, { matrix });
      
      const outsideRect  = pointFrame.vertex().setTransform().rect();
      const variatedRect = outsideRect.diff(pointFrame);
      
      this.outSide = { ...variatedRect };
      
      this.gridPoints = pointFrame.piecesWithCount([this.column, this.row], (rect)=>{
        return rect.findPoint("middle center").setTransform();
      });
      
      this.gridPoints2 = pointFrame.piecesWithCount([this.column, this.row], (rect)=>{
        return rect.findPoint("middle center")
          .setTransform()
          .applyTransform()
          .subtract({ x:variatedRect.left, y:variatedRect.top });
      });
    }
  },
  mounted (){
    //const mainTransform = getElementTransform(this.$refs.mainRect);
    //const mainTransformMatrix = getElementTransformMatrix(this.$refs.mainRect);
    
    this.mainDraw();
  }
};
</script>

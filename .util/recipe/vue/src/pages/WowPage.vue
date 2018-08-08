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
              <div :style="mainRectStyle" ref="mainRect"></div>
              <PadoPoint 
                v-for="(point, index) in gridPoints"
                :key="index"
                :x="point.x"
                :y="point.y"
              >
              </PadoPoint>
            </PadoScreen>
          </td>
        </tr>
      </tbody>
    </table>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import PadoRect from '@/components/PadoRect.vue';
import PadoScreen from '@/components/PadoScreen.vue';
import PadoMinimap from '@/components/PadoMinimap.vue';
import PadoPoint from '@/components/PadoPoint.vue';
import { rect } from '../../../../../.src/modules/stance';
import {
  transformStyleVariant,
  transformMatrixVariant,
  //getElementOffsetRect,
  //getElementBoundingRect,
  getElementTransformMatrix,
  getElementTransform
} from '../../../../../.src/web';

export default {
  components: {
    AppLayout,
    PadoRect,
    PadoScreen,
    PadoMinimap,
    PadoPoint
  },
  data: ()=>({
    gridSize  : 50,
    column    : 5,
    row       : 5,
    rotateX   : 30,
    rotateY   : 0,
    rotateZ   : 10,
    gridPoints: []
  }),
  computed: {
    mainRectSize (){
      return {
        width : this.column * this.gridSize,
        height: this.row * this.gridSize
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
      const pointFrame = rect(0, 0, width, height, { matrix: transformMatrixVariant(this) });
      
      const outsideRect = pointFrame.vertex().applyTransform().rect();
      const differenceValues = outsideRect.diff(pointFrame);
      
      console.log('outsideRect', outsideRect.toJSON());
      console.log('differenceValues', { ...differenceValues }, { ...differenceValues.move() }, { ...differenceValues.offset() });
      
      this.gridPoints = pointFrame.piecesWithCount([this.column, this.row], (rect)=>{
        return rect.findPoint("middle center").applyTransform();
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

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
          <td></td>
          <td></td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td colspan="3">
            <PadoScreen ref="main" style="width:100%;height:200px;">
              <div :style="mainRectStyle"></div>
              <PadoPoint 
                v-for="point in gridPoints"
                :x="point.x"
                :y="point.y"
                placement="top"
              >
              p
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
export default {
  components: {
    AppLayout,
    PadoRect,
    PadoScreen,
    PadoMinimap,
    PadoPoint
  },
  data: ()=>({
    gridSize: 50,
    column  : 10,
    row     : 10
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
        width : `${width}px`,
        height: `${height}px`,
        border: '1px solid blue'
      };
    },
    gridPoints (){
      const { width, height } = this.mainRectSize;
      const frame = rect(0, 0, width, height);
      return frame.piecesWithCount([this.column, this.row], (rect)=>{
        return rect.findPoint("middle center");
      });
    }
  }
};
</script>

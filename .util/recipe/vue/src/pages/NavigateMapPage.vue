<template>
  <AppLayout>
    <div>NavigateMapPage</div>
    <div>
      <table class="form-table" style="width:400px;">
        <colgroup>
          <col style="width:100px;">
          <col>
          <col style="width:50px;">
        </colgroup>
        <tbody>
          <tr>
            <th>root size</th>
            <td>
              <PadoSlider v-model="rectSize" input-cycle="enter" min-value="100" max-value="250"></PadoSlider>
            </td>
            <td>{{ rectSize }}</td>
          </tr>
          <tr>
            <th>col count</th>
            <td>
              <PadoSlider v-model="colCount" input-cycle="enter" min-value="1" max-value="20" @input="drawRect"></PadoSlider>
            </td>
            <td>{{ colCount }}</td>
          </tr>
          <tr>
            <th>row count</th>
            <td>
              <PadoSlider v-model="rowCount" input-cycle="enter" min-value="1" max-value="20"  @input="drawRect"></PadoSlider>
            </td>
            <td>{{ rowCount }}</td>
          </tr>
        </tbody>
      </table>
      <Layer root>
        <Layer>
          <PadoRect :size="rectSize">
            <template slot-scope="scope">Root Size<br>{{scope.rect.width}}</template>
          </PadoRect>
        </Layer>
        <Layer opacity=".5">
          <PadoRect size="100" style="border:1px solid silver"></PadoRect>
        </Layer>
      </Layer>
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from '@/layouts/AppLayout.vue';
import Layer from '@/components/Layer.vue';
import PadoSlider from '@/components/PadoSlider.vue';
import PadoRect from '@/components/PadoRect.vue';
import { rect } from '@sepalang/pado/.src/modules/dimension';
import { getElementBoundingRect } from '@sepalang/pado/.src/web/env/dom';

export default {
  components: {
    AppLayout,
    Layer,
    PadoSlider,
    PadoRect
  },
  data: ()=>({
    rectSize: 150,
    colCount: 1,
    rowCount: 1
  }),
  methods: {
    drawRect (){
      console.log("drawrect", this.colCount, this.rowCount);
      const rootRect = rect(0,0,this.rectSize,this.rectSize);
      
      console.log("rootRect",rootRect.piecesAsCount([this.colCount, this.rowCount]))
    }
  },
  mounted (){
    this.drawRect();
  }
};
</script>

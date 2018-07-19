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
            <th>col count</th>
            <td>
              <PadoSlider v-model="colCount" input-cycle="enter" min-value="1" max-value="20"></PadoSlider>
            </td>
            <td>{{ colCount }}</td>
          </tr>
          <tr>
            <th>row count</th>
            <td>
              <PadoSlider v-model="rowCount" input-cycle="enter" min-value="1" max-value="20"></PadoSlider>
            </td>
            <td>{{ rowCount }}</td>
          </tr>
        </tbody>
      </table>
      <Layer root>
        <Layer>
          <PadoRect size="200">
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

export default {
  components: {
    AppLayout,
    Layer,
    PadoSlider,
    PadoRect
  },
  data: ()=>({
    colCount: 1,
    rowCount: 1
  }),
  methods: {
    drawRect (){
      rect();
    }
  },
  mounted (){
    this.drawRect();
  }
};
</script>

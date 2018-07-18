<template>
  <AppLayout>
    <div>NavigateMapPage</div>
    
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
            <PadoSlider v-model="colCount" minimum="1" maximum="20"></PadoSlider>
          </td>
          <td>{{ colCount }}</td>
        </tr>
        <tr>
          <th>row count</th>
          <td>
            <PadoSlider v-model="rowCount" min="1" max="20"></PadoSlider>
          </td>
          <td>{{ rowCount }}</td>
        </tr>
      </tbody>
    </table>
    
  </AppLayout>
</template>
<script>
import AppLayout from '@/layouts/AppLayout.vue';
import PadoSlider from '@/components/PadoSlider.vue';
export default {
  components: {
    AppLayout,
    PadoSlider
  },
  data: ()=>({
    colCount: 1,
    rowCount: 1
  })
};
</script>

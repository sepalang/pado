<template>
  <AppLayout>
    <div>PointPage</div>
    <VERect mixins="line" :width="rectWidth" :height="rectWidth">
      <VEPoint mixins="print" :size="size" :x="x" :y="y" label="[xy]"></VEPoint>
      <VEPoint mixins="print" :size="size" :rx="rx" :ry="ry" label="[rx,ry]"></VEPoint>
    </VERect>
    
    <table class="form-table" style="width:400px;">
      <colgroup>
        <col style="width:100px;">
        <col>
        <col style="width:50px;">
      </colgroup>
      <tbody>
        <tr>
          <th>size</th>
          <td>
            <VESlider v-model="size" input-cycle="enter" min-value="0" max-value="50" @input="drawRect"></VESlider>
          </td>
          <td>{{ size }}</td>
        </tr>
        <tr>
          <th>x</th>
          <td>
            <VESlider v-model="x" input-cycle="enter" min-value="0" :max-value="rectWidth" @input="drawRect"></VESlider>
          </td>
          <td>{{ x }}</td>
        </tr>
        <tr>
          <th>y</th>
          <td>
            <VESlider v-model="y" input-cycle="enter" min-value="0" :max-value="rectWidth" @input="drawRect"></VESlider>
          </td>
          <td>{{ y }}</td>
        </tr>
        <tr>
          <th>rx</th>
          <td>
            <VESlider v-model="rx" input-cycle="enter" min-value="0" :max-value="1" @input="drawRect"></VESlider>
          </td>
          <td>{{ rx }}</td>
        </tr>
        <tr>
          <th>ry</th>
          <td>
            <VESlider v-model="ry" input-cycle="enter" min-value="0" :max-value="1" @input="drawRect"></VESlider>
          </td>
          <td>{{ ry }}</td>
        </tr>
        
      </tbody>
    </table>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import VEPoint from '@/components/VEPoint.vue';
import VERect from '@/components/VERect.vue';
import VESlider from '@/components/VESlider.vue';

export default {
  components: {
    AppLayout,
    VEPoint,
    VERect,
    VESlider
  },
  data (){
    return {
      x:0,
      y:0,
      rx:0,
      ry:0,
      size:5,
      rectWidth:200
    };
  },
  mounted (){
    
  }
};
</script>

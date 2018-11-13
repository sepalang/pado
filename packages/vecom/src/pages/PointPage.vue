<template>
  <AppLayout>
    <div>PointPage</div>
    <VERect mixins="line" :size="rectWidth">
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
            <VESlider v-model="size" input-cycle="enter" max-value="50"></VESlider>
          </td>
          <td>{{ size }}</td>
        </tr>
        <tr>
          <th>x</th>
          <td>
            <VESlider v-model="x" input-cycle="enter" :max-value="rectWidth"></VESlider>
          </td>
          <td>{{ x }}</td>
        </tr>
        <tr>
          <th>y</th>
          <td>
            <VESlider v-model="y" input-cycle="enter" :max-value="rectWidth"></VESlider>
          </td>
          <td>{{ y }}</td>
        </tr>
        <tr>
          <th>rx</th>
          <td>
            <VESlider v-model="rx" input-cycle="enter" :max-value="1"></VESlider>
          </td>
          <td>{{ rx }}</td>
        </tr>
        <tr>
          <th>ry</th>
          <td>
            <VESlider v-model="ry" input-cycle="enter" :max-value="1"></VESlider>
          </td>
          <td>{{ ry }}</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <VERect mixins="line" :size="rectWidth">
      <VEPoint mixins="print" :x="center.x" :y="center.y" label="[xy]"></VEPoint>
      <VEPoint mixins="print" :x="other.x" :y="other.y" label="[angledis]"></VEPoint>
    </VERect>
    <table class="form-table" style="width:400px;">
      <colgroup>
        <col style="width:100px;">
        <col>
        <col style="width:50px;">
      </colgroup>
      <tbody>
        <tr>
          <th>center.x</th>
          <td>
            <VESlider v-model="center.x" input-cycle="enter" :max-value="rectWidth"></VESlider>
          </td>
          <td>{{ center.x }}</td>
        </tr>
        <tr>
          <th>center.y</th>
          <td>
            <VESlider v-model="center.y" input-cycle="enter" :max-value="rectWidth"></VESlider>
          </td>
          <td>{{ center.y }}</td>
        </tr>
        <tr>
          <th>angle</th>
          <td>
            <VESlider v-model="angle" input-cycle="enter" :max-value="360"></VESlider>
          </td>
          <td>{{ angle }}</td>
        </tr>
        <tr>
          <th>distance</th>
          <td>
            <VESlider v-model="distance" input-cycle="enter" :max-value="100"></VESlider>
          </td>
          <td>{{ distance }}</td>
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
import { point, movement } from '@sepalang/pado';

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
      rectWidth:200,
      center:{
        x:50,
        y:50
      },
      angle:0,
      distance:50
    };
  },
  computed:{
    other (){
      const { x, y } = this.center;
      const angle = this.angle;
      const distance = this.distance;
      
      const { x:resultX, y:resultY } = movement(distance).setAngle(angle).from(point(x,y));
      return { x:resultX,y:resultY };
    }
  },
  mounted (){
    
  }
};
</script>

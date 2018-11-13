<template>
  <AppLayout>
    <div>PointPage</div>
    <VERect mixins="line" :width="200" :height="200">
      <VEPoint mixins="print"></VEPoint>
    </VERect>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import VEPoint from '@/components/VEPoint.vue';
import VERect from '@/components/VERect.vue';

export default {
  components: {
    AppLayout,
    VEPoint,
    VERect
  },
  data (){
    return {
      
    };
  },
  mounted (){
    
  }
};
</script>

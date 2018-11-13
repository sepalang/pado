<template>
  <AppLayout>
    <div>PanzoomPage</div>
    <VEPanzoom>FPZ</VEPanzoom>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import VEPanzoom from '@/components/VEPanzoom.vue';
import VEPanzoomMap from '@/components/VEPanzoomMap.vue';

export default {
  components: {
    AppLayout,
    VEPanzoom,
    VEPanzoomMap
  },
  data (){
    return {
      screenViewport: undefined
    };
  },
  mounted (){
    
  }
};
</script>

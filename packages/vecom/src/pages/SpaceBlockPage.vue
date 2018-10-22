<template>
  <AppLayout>
    <div>SpaceBlockPage</div>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import { space, block } from '@sepalang/pado/modules/block';
export default {
  components: {
    AppLayout
  },
  mounted (){
    const lineSpace = space([0, 10], [0, 100]);
    
    console.log('lineSpace.getRange', lineSpace.range);
    console.log('lineSpace.getDomain', lineSpace.domain);
    console.log('lineSpace.block', lineSpace.domainRangeSize(2));
    
    const block = lineSpace.block([0, 1]);
    console.log('block', { ...block });
    
    
    const multiSpace = space({x: [0, 10], y: [0, 10]}, {x: [0, 100], y: [0, 100]});
    console.log('multiSpace.block', multiSpace.domainRangeSize({x: 2}));
    
    //a.block([0,3]);
  }
};
</script>

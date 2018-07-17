<template>
  <AppLayout>
    <div>SVG Page</div>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import { asMatrix, multiplyMatrix } from '../../../../../.src/functions';
export default {
  components: {
    AppLayout
  },
  mounted (){
    console.log('multiplyMatrix', multiplyMatrix(
      asMatrix([1, 2, 3, 4], 2),
      asMatrix([5, 6, 7, 8], 2)
    ));

    const transformMatrix = asMatrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ], 4);

    const pointMatrix = asMatrix([
      4, 3, 2, 1
    ], 1);

    const multiply = multiplyMatrix(transformMatrix, pointMatrix);
    console.log('matrix', multiply);
  }
};
</script>

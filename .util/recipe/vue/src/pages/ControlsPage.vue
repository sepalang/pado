<template>
  <AppLayout>
    <div>Controls</div>
    {{ selected }}
    <PadoRadio v-model="selected" value="1">1</PadoRadio>
    <PadoRadio v-model="selected" value="2">2</PadoRadio>
    <PadoRadio v-model="selected" value="3">3</PadoRadio>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import PadoRadio from '@/components/PadoRadio.vue';

export default {
  components: {
    AppLayout,
    PadoRadio
  },
  data:()=>({
    selected: '2'
  })
};
</script>

<template>
  <AppLayout>
    <div>Controls</div>
    <div>
      <hgroup>radio</hgroup>
      <PadoRadio v-model="radio" value="1">1</PadoRadio>
      <PadoRadio v-model="radio" value="2">2</PadoRadio>
      <PadoRadio v-model="radio" value="3">3</PadoRadio>
      <div>{{radio}}</div>
    </div>
    <div>
      <hgroup>checkbox - boolean</hgroup>
      <PadoRadio v-model="check_boolean.a">1</PadoRadio>
      <PadoRadio v-model="check_boolean.b">2</PadoRadio>
      <PadoRadio v-model="check_boolean.c">3</PadoRadio>
      <div>{{check_boolean}}</div>
    </div>
    <div>
      <hgroup>checkbox multiple</hgroup>
      <PadoRadio v-model="radio" value="1">1</PadoRadio>
      <PadoRadio v-model="radio" value="2">2</PadoRadio>
      <PadoRadio v-model="radio" value="3">3</PadoRadio>
      <div></div>
    </div>
    
    
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import PadoRadio from '@/components/PadoRadio.vue';
import PadoCheckbox from '@/components/PadoCheckbox.vue';

export default {
  components: {
    AppLayout,
    PadoRadio,
    PadoCheckbox
  },
  data: ()=>({
    radio        : '2',
    check_boolean: {
      a: false,
      b: false,
      c: false
    }
  })
};
</script>

<template>
  <AppLayout>
    <div>Controls</div>
    <div>
      <hgroup>radio</hgroup>
      <PadoRadio v-model="radio" value="1">1</PadoRadio>
      <PadoRadio v-model="radio" value="2">2</PadoRadio>
      <PadoRadio v-model="radio" value="3">3</PadoRadio>
      <PadoRadio v-model="radio" :unvalue="false">B</PadoRadio>
      <div>{{radio}}</div>
    </div>
    <div>
      <hgroup>checkbox - boolean</hgroup>
      <PadoCheckbox v-model="check_boolean.a">1</PadoCheckbox>
      <PadoCheckbox v-model="check_boolean.b">2</PadoCheckbox>
      <PadoCheckbox v-model="check_boolean.c">3</PadoCheckbox>
      <PadoCheckbox v-model="check_boolean.d" :unvalue="null">B</PadoCheckbox>
      <div>{{check_boolean}}</div>
    </div>
    <div>
      <hgroup>checkbox multiple</hgroup>
      <PadoCheckbox v-model="check_multiple" multiple value="1">1</PadoCheckbox>
      <PadoCheckbox v-model="check_multiple" multiple value="2">2</PadoCheckbox>
      <PadoCheckbox v-model="check_multiple" multiple value="3">3</PadoCheckbox>
      <PadoCheckbox v-model="check_multiple" multiple>B</PadoCheckbox>
      <div>{{check_multiple}}</div>
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
    },
    check_multiple: ['2']
  })
};
</script>

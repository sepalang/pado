<template>
  <UsageLayout>
    <h1></h1>
    <button @click="openSampleModal(0)">modal0</button>
    <button @click="openSampleModal(1000)">modal1000</button>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/PadoSlider.vue';
  import PadoRect from '../component/PadoRect.vue';
  import { rect, line, point } from '../../../../.src/modules';
  
  import { createVue } from '../service/vue-compile'
  import SampleModal from '../component/views/SampleModal.vue'
  
  let index = 0;
  
  export default {
    components:{ UsageLayout, PadoSlider, PadoRect },
    data (){
      return {
        bounding:{},
        rectSize:40,
        x:0,
        y:0
      }
    },
    methods:{
      openSampleModal (awaitTime=0){
        createVue(SampleModal,{
          props:{
            no:index++,
            awaitTime
          },
          appendTo:document.body
        });
      }
    }
  }
</script>
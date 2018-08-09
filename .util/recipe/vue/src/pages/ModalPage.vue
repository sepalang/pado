<template>
  <AppLayout>
    <div>BaseModal</div>
    <button @click="openSampleModal(0)">modal0</button>
    <button @click="openSampleModal(1000)">modal1000</button>
    
    <hr>
    
    <div>ModalView</div>
  </AppLayout>
</template>
<script>
import AppLayout from '@/layouts/AppLayout.vue';
import { createVue } from '@/utils';
import SampleModal from '@/modules/SampleModal.vue';
export default {
  components: {
    AppLayout
  },
  data (){
    return {
      modalIndex: 0
    };
  },
  methods: {
    openSampleModal (awaitTime = 0){
      createVue(SampleModal, {
        props: {
          no: this.modalIndex++,
          awaitTime
        },
        appendTo: document.body
      });
    }
  }
};
</script>

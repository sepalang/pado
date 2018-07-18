<template>
  <ModalComponent @link="linkModal">
    <div role="dialog" style="width:400px;">
      <button @click="modal.methods.close()">{{ no }} :: {{ awaitTime/1000 }}초 후 닫기</button>
    </div>
  </ModalComponent>
</template>
<script>
import ModalComponent from '@/components/bases/ModalComponent.vue';
import { timeout } from '../../../../../.src/modules/promise';

// destroy 하면 모달이 자동으로 제거됨  
export default {
  components:{
    ModalComponent
  },
  props:{
    no       :{},
    awaitTime:{
      default:0
    }
  },
  methods:{
    linkModal (link){
      link.on({
        close:(other)=>{
          if (this.awaitTime){
            return timeout(this.awaitTime).then(()=>`wait ${this.awaitTime} ms`);
          } else {
            return true;
          }
        }
      });
      this.modal = link;
    }
  }
};
</script>

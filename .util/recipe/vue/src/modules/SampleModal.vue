<template>
  <BaseModal @link="linkModal">
    <div role="dialog" style="width:400px;">
      <header>
        <b>{{ no }} : title</b>
        <controls>
          <a>&times;</a>
        </controls>
      </header>
      <stage>
        Main description
      </stage>
      <footer>
        <p>Foot description</p>
        <controls>
          <button @click="modal.methods.close()">
            Close after {{ awaitTime/1000 }} sec
          </button>
        </controls>
      </footer>
    </div>
  </BaseModal>
</template>
<script>
import BaseModal from '@/components/bases/BaseModal.vue';
import { timeout } from '../../../../../.src/modules/promise';

// destroy 하면 모달이 자동으로 제거됨  
export default {
  components:{
    BaseModal
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

<template>
  <UsageLayout>
    <PadoRect size="50" class="first-rect" :style="{transform:firstTransform,border:'1px solid red'}"></PadoRect>
    <PadoRect size="100" :style="{transform:secondTransform}" top="100" left="100"></PadoRect>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  import PadoRect from '../component/pado-rect.vue';
  import { transformVariant, getElementTransform, getElementBoundingRect } from '../../../../.src/web';
  //import { rect, line, point } from '../../../../.src/modules';
  
  import { createVue, nextTick } from '../service/vue-compile'
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
    },
    computed:{
      firstTransform (){
        const transformValue = transformVariant({ rotate3d:[20], perspective:100 });
        return transformValue;
      },
      secondTransform (){
        
      }
    },
    mounted (){
      
      nextTick(()=>{
        const firstRect = this.$el.querySelectorAll(".first-rect")[0];
        const gt = getElementTransform(firstRect);
        const boundings = getElementBoundingRect(firstRect);
      })
    }
  }
</script>
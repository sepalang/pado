<template>
  <UsageLayout>
    <h1></h1>
    <div>
      <PadoTab>
        <PadoTabItem>아이템</PadoTabItem>
        <PadoTabItem>아이템</PadoTabItem>
        <PadoTabItem>아이템</PadoTabItem>
      </PadoTab>
    </div>
    <div>
      <PadoTab>
        <PadoTabItem>아이템</PadoTabItem>
      </PadoTab>
    </div>
    <div>
      <PadoTab>
        <PadoTabItem>아이템</PadoTabItem>
      </PadoTab>
    </div>
    <div>
      <PadoTab>
        <PadoTabItem>아이템</PadoTabItem>
      </PadoTab>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoTab from '../component/PadoTab.vue';
  import PadoTabItem from '../component/PadoTabItem.vue';
  
  let index = 0;
  
  export default {
    components:{ UsageLayout, PadoTab, PadoTabItem },
    data (){
      return {
        nativeTab:{
          model:undefined
        },
        indexedTab:{
          model:undefined
        },
        valuedTab:{
          model:undefined
        },
        tabItems:[1,2,3,4]
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
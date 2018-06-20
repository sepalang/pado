<template>
  <UsageLayout>
    <h1>Slider</h1>
    <div>
      <PadoSlider v-model="sliderValue" @input="s2Value=$event" style="width:40%"></PadoSlider>
    </div>
    <div>
      <PadoSlider v-model="sliderValue" @input="s2Value=$event" style="width:100px"></PadoSlider>
    </div>
    <div>
      <PadoSlider v-model="s2Value" @enter="sliderValue=$event" style="width:150px"></PadoSlider>
    </div>
    <div>
      {{ sliderValue }}
    </div>
    
    <div>
      <PadoSlider @enter="nomodelValue=$event"></PadoSlider>
      <br>
      {{ nomodelValue }}
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/PadoSlider.vue';
  
  export default {
    components:{ UsageLayout, PadoSlider },
    data (){
      return {
        nomodelValue:null,
        sliderValue:0,
        s2Value:0
      }
    }
  }
</script>
<template>
  <UsageLayout>
    <h1>Slider</h1>
    <div>
      <pado-slider v-model="sliderValue" @input="s2Value=$event" style="width:40%"></pado-slider>
    </div>
    <div>
      <pado-slider v-model="sliderValue" @input="s2Value=$event" style="width:100px"></pado-slider>
    </div>
    <div>
      <pado-slider v-model="s2Value" @drawInput="sliderValue=$event" style="width:150px"></pado-slider>
    </div>
    <div>
      {{ sliderValue }}
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  
  export default {
    components:{ UsageLayout, PadoSlider },
    props: {
      
    },
    data (){
      return {
        sliderValue:0,
        s2Value:0
      }
    }
  }
</script>
<style>
  dd+dt {
    margin-top:20px;
  }
  dd {
    margin-left:20px;
  }
</style>
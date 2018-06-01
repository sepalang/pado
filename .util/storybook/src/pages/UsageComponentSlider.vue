<template>
  <UsageLayout>
    <h1>Slider</h1>
    <pado-slider></pado-slider>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  
  export default {
    components:{ UsageLayout, PadoSlider },
    props: {
      
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
<template>
  <UsageLayout>
    <h1>Circle</h1>
    <div>
      <!--
      <pado-slider v-model="repeatCount" min-value="1" max-value="30" style="width:150px"></pado-slider>
      {{ repeatCount }}
      <br>
      -->
      <pado-slider @drawInput="circleValue=$event" value="80" style="width:150px"></pado-slider>
      {{ circleValue }}
    </div>
    <div>
      <pado-circle v-model="circleValue"></pado-circle>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  import PadoCircle from '../component/pado-circle.vue';
  
  export default {
    components:{ UsageLayout, PadoSlider, PadoCircle },
    data (){
      return {
        repeatCount:1,
        circleValue:80
      }
    }
  }
</script>
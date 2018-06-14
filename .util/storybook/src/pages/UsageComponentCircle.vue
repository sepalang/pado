<template>
  <UsageLayout>
    <h1>Circle</h1>
    <div>
      <pado-slider style="width:150px" v-model="circleSize" min-value="20"></pado-slider>
      {{ circleSize }}
    </div>
    <div>
      <pado-slider style="width:150px" v-bind:value="repeatCount" @drawInput="repeatCount=$event" min-value="1"></pado-slider>
      {{ repeatCount }}
    </div>
    <div>
      <pado-slider style="width:150px" v-bind:value="circleValue" @drawInput="circleValue=$event"></pado-slider>
      {{ circleValue }}
    </div>
    <div>
      <pado-circle v-for="i in repeatCircles" :key="i" v-model="circleValue" :size="circleSize"></pado-circle>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/pado-slider.vue';
  import PadoCircle from '../component/pado-circle.vue';
  import { times } from '../../../../.src/functions';
  
  export default {
    components:{ UsageLayout, PadoSlider, PadoCircle },
    data (){
      return {
        repeatCount:2,
        circleSize:50,
        circleValue:80
      }
    },
    computed:{
      repeatCircles (){
        return times(this.repeatCount,i=>i);
      }
    }
  }
</script>
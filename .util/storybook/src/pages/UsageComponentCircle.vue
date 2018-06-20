<template>
  <UsageLayout>
    <h1>Circle</h1>
    <div>
      <PadoSlider style="width:150px" v-model="circleSize" min-value="20"></PadoSlider>
      {{ circleSize }}
    </div>
    <div>
      <PadoSlider style="width:150px" v-bind:value="repeatCount" @drawInput="repeatCount=$event" min-value="1"></PadoSlider>
      {{ repeatCount }}
    </div>
    <div>
      <PadoSlider style="width:150px" v-bind:value="circleValue" @drawInput="circleValue=$event"></PadoSlider>
      {{ circleValue }}
    </div>
    <div>
      <PadoCircle v-for="i in repeatCircles" :key="i" v-model="circleValue" :size="circleSize"></PadoCircle>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/PadoSlider.vue';
  import PadoCircle from '../component/PadoCircle.vue';
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
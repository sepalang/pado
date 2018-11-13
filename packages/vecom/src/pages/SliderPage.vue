<template>
  <AppLayout>
    <div>SliderPage</div>
    
    <div>
      <h4>input-cycle</h4>
      <VESlider v-model="sliderValue" input-cycle="enter" style="width:40%"></VESlider>
    </div>
    
    <div>
      <h4>min-value max-value</h4>
      <div>{{sliderValue}}</div>
      <div>
        <VESlider v-model="sliderValue" input-cycle="enter" style="width:40%" min-value="20" max-value="50"></VESlider>
      </div>
      <div>
        <VESlider v-model="sliderValue" input-cycle="enter" style="width:40%" min-value="0" max-value="20"></VESlider>
      </div>
    </div>
    
    <div>
      <h4>share model</h4>
      <div>
        <VESlider v-model="sliderValue" @input="s2Value=$event" style="width:40%"></VESlider>
      </div>
      <div>
        <VESlider v-model="sliderValue" @input="s2Value=$event" style="width:100px"></VESlider>
      </div>
      <div>
        <VESlider v-model="s2Value" @enter="sliderValue=$event" style="width:150px"></VESlider>
      </div>
      <div>
        {{ sliderValue }}
      </div>
    </div>
    
    <div>
      <h4>no model</h4>
      <VESlider @enter="nomodelValue=$event"></VESlider>
      <br>
      {{ nomodelValue }}
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import VESlider from '@/components/VESlider.vue';

export default {
  components: {
    AppLayout,
    VESlider
  },
  data (){
    return {
      nomodelValue: null,
      sliderValue : 0,
      s2Value     : 0
    };
  }
};
</script>

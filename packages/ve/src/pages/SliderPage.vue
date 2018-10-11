<template>
  <AppLayout>
    <div>SliderPage</div>
    
    <div>
      <h4>input-cycle</h4>
      <PadoSlider v-model="sliderValue" input-cycle="enter" style="width:40%"></PadoSlider>
    </div>
    
    <div>
      <h4>min-value max-value</h4>
      <div>{{sliderValue}}</div>
      <div>
        <PadoSlider v-model="sliderValue" input-cycle="enter" style="width:40%" min-value="20" max-value="50"></PadoSlider>
      </div>
      <div>
        <PadoSlider v-model="sliderValue" input-cycle="enter" style="width:40%" min-value="0" max-value="20"></PadoSlider>
      </div>
    </div>
    
    <div>
      <h4>share model</h4>
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
    </div>
    
    <div>
      <h4>no model</h4>
      <PadoSlider @enter="nomodelValue=$event"></PadoSlider>
      <br>
      {{ nomodelValue }}
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import PadoSlider from '@/components/PadoSlider.vue';

export default {
  components: {
    AppLayout,
    PadoSlider
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

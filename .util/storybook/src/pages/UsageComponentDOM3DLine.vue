<template>
  <UsageLayout>
    <div>
      <PadoSlider v-model="firstRectTransform.rotateX" input-cycle="enter" @enter="drawLine" min-value="-360" max-value="360" style="width:300px;"></PadoSlider>{{ firstRectTransform.rotateX }}<br>
      <PadoSlider v-model="firstRectTransform.rotateY" input-cycle="enter" @enter="drawLine" min-value="-360" max-value="360" style="width:300px;"></PadoSlider>{{ firstRectTransform.rotateY }}
    </div>
    <div style="position:relative">
      <PadoRect class="first-rect" size="50" :style="{transform:firstTransform}" top="50" left="50"></PadoRect>
      <PadoRect class="seconde-rect" size="100" :style="{transform:secondTransform}" top="150" left="150"></PadoRect>
      <div class="pointer-placeholder"></div>
    </div>
  </UsageLayout>
</template>
<script>
  import UsageLayout from '../layout/UsageLayout.vue';
  import PadoSlider from '../component/PadoSlider.vue';
  import PadoRect from '../component/PadoRect.vue';
  import { 
    transformVariant, 
    getElementTransform, 
    getElementBoundingRect, 
    getElementOffsetRect 
  } from '../../../../.src/web';
  //import { rect, line, point } from '../../../../.src/modules';
  
  import { createVue, nextTick } from '../service/vue-compile'
  import SampleModal from '../component/views/SampleModal.vue'
  
  let index = 0;
  
  export default {
    components:{ UsageLayout, PadoSlider, PadoRect },
    data (){
      return {
        perspective:100,
        firstRectTransform:{
          rotateX:0,
          rotateY:0
        },
        secondRectTransform:{
          rotate3d:[0]
        }
      }
    },
    methods:{
      drawLine (){
        nextTick(()=>{
          const placeholder = this.$el.querySelectorAll(".pointer-placeholder")[0];
        
          const firstEl = this.$el.querySelectorAll(".first-rect")[0];
          const secondEl = this.$el.querySelectorAll(".seconde-rect")[0];
        
          const firstRectOffset  = getElementOffsetRect(firstEl);
          const secondRectOffset = getElementOffsetRect(secondEl);
        
          const firstRectTransform  = getElementTransform(firstEl);
          //const secondRectTransform = getElementTransform(secondEl);
        
          //empty
          Array.from(placeholder.children).forEach(child=>placeholder.removeChild(child));
        
          firstRectOffset.vertex().transform(firstRectTransform,firstRectOffset).forEach((point)=>{
            const pointTag = document.createElement("point");
            pointTag.setAttribute("style",`left:${point.x}px;top:${point.y}px;`)
            placeholder.append(pointTag);
          });
        })
      },
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
        const transformValue = transformVariant({ 
          rotateX:this.firstRectTransform.rotateX, 
          rotateY:this.firstRectTransform.rotateY, 
          perspective:this.perspective 
        });
        console.log("transformValue",transformValue)
        return transformValue;
      },
      secondTransform (){
        const transformValue = transformVariant({ rotate3d:this.secondRectTransform.rotate3d });
        return transformValue;
      }
    },
    mounted (){
      this.drawLine();
    }
  }
</script>
<style>
  point {
    display:block;
    width:3px;
    height:3px;
    background-color:red;
    position:absolute;
    
  }
  .pointer-placeholder {
    position:absolute;
    top:0;
    left:0;
    width:300px;
    height:300px;
    pointer-events:none;
    transform:translateZ(10000px);
    > point {
      transform:translateZ(-50%,-50%);
    }
  }
</style>
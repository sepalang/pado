<template>
  <div class="v-pado-minimap" :style="rectStyle">
    <div class="v-pado-minimap-view" :style="viewStyle">
      <slot></slot>
      <div class="v-pado-minimap-port" :style="portStyle"></div>
    </div>
  </div>
</template>
<script>
import { limitNumber, top } from '../../../../../.src/functions';
import { dragHelper } from '../../../../../.src/web';
import { nextTick } from '@/service';
import HighOrderRect from './mixins/HighOrderRect';

export default {
  mixins: [
    HighOrderRect([['width', 'height', 'size', 'rect'], ['auto', 'auto']])
  ],
  model: {
    prop : 'offset',
    event: 'input'
  },
  props: {
    padding: {
      default: 0
    },
    scrollStyle: {
      default: "drag"
    },
    viewport: {
      type: Object
    }
  },
  data: ()=>({
    readyEl      : false,
    viewportRatio: 1
  }),
  computed: {
    rectStyle (){
      const { width, height } = this.rectValue;
      const [left, top] = [this.left + 'px', this.top + 'px'];
      
      const overflow = (()=>{
        switch (this.scrollStyle){
          case "drag":
            return "hidden";
            break;
          default:
            return "auto";
            break;
        }
      })();
      
      return { width: width + 'px', height: height + 'px', overflow, left, top};
    },
    viewStyle (){
      const viewportRatio = this.viewportRatio;
      const readyEl = this.readyEl;
      
      if(readyEl === false){
        return {visibility: "hidden"};
      }
      
      const style = {
        transform: `translate(-50%, -50%) scale(${viewportRatio})`,
        left     : `50%`,
        top      : `50%`
      };
      
      return style;
    },
    portVariant (){
      const port = this.viewport && this.viewport.port;
      if(!port){
        return {
          width : 10,
          height: 10
        };
      }
      
      return {
        width : port.width,
        height: port.height
      };
    },
    portStyle (){
      const { width:portWidth, height:portHeight } = this.portVariant;
      
      const style = {
        width : `${portWidth}px`,
        height: `${portHeight}px`
      };
      
      return style;
    }
  },
  watch: {
    readyEl (newValue){
      if(newValue === true){
        const viewElement = this.$el.querySelector(".v-pado-minimap-view");
        const { offsetWidth:masterWidth, offsetHeight:masterHeight } = this.$el;
        const { scrollWidth:viewWidth, scrollHeight:viewHeight } = viewElement;
        this.viewportRatio = top([masterWidth / viewWidth, masterHeight / viewHeight], false);
      }
    }
  },
  mounted (){
    nextTick(()=>{
      const viewElement = this.$el.querySelector(".v-pado-minimap-view");
      const portElement = this.$el.querySelector(".v-pado-minimap-port");
    
      dragHelper(portElement, ({ element:dragElement })=>{
        const [ element ] = dragElement;
      
        const startPosition = {
          top : 0,
          left: 0
        };
      
        return {
          start: ()=>{
            startPosition.left = element.offsetLeft;
            startPosition.top = element.offsetTop;
          },
          move: ({ pointer })=>{
            const boostX = pointer.offsetX;
            const boostY = pointer.offsetY;
            
            let { destLeft:left, destTop:top } = {
              destLeft: limitNumber(
                startPosition.left + boostX,
                viewElement.scrollWidth - element.offsetWidth,
                0
              ),
              destTop: limitNumber(
                startPosition.top + boostY,
                viewElement.scrollHeight - element.offsetHeight,
                0
              )
            };
            dragElement.css({ left, top });
          }
        };
      });
      
      this.readyEl = true;
    });
  }
};
</script>
<style lang="scss">
  .v-pado-minimap {
    display:inline-block;
    background-color:#eee;
    position:relative;
    overflow:auto;

    > .v-pado-minimap-view {
      position:absolute;
      
      * {
        pointer-events:none;
      }
      
      > .v-pado-minimap-port {
        pointer-events:all;
        background-color:rgba(0,0,0,.2);
        position:absolute;
        top:0;
        left:0;
      }
    }
    
    img {
      display:inline-block;
    }
  }
</style>

<template>
  <div class="v-pado-screen" :style="rectStyle">
    <div class="v-pado-screen-content" :style="innerRectStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { dragHelper } from '../../../../../.src/web';
import { nextTick, nextQueue } from '@/service';
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
    innerRectStyle (){
      const paddingValue = `${this.padding || 0}px`;
      const style = {
        "border": `${paddingValue} solid transparent`
      };
      
      if(typeof this.innerWidth === "number"){
        style.width = `${this.innerWidth}px`;
      }
      
      if(typeof this.innerHeight === "number"){
        style.height = `${this.innerHeight}px`;
      }
      
      return style;
    },
    hasViewport (){
      return typeof this.viewport === "object" && this.viewport !== null;
    }
  },
  methods: {
    updateViewport (){
      this.hasViewport && nextQueue(()=>{
        const { scrollLeft, scrollTop, offsetWidth, offsetHeight, scrollWidth, scrollHeight } = this.$el;
        
        this.$set(this.viewport, 'view', {
          width : scrollWidth,
          height: scrollHeight
        });
        
        this.$set(this.viewport, 'port', {
          left  : scrollLeft,
          top   : scrollTop,
          width : offsetWidth,
          height: offsetHeight
        });
      }, 10);
    }
  },
  mounted (){
    if(this.scrollStyle === "drag"){
      dragHelper(this.$el, ({ element:jqElement })=>{
        const element = jqElement[0];
        const initialScroll = {
          top : 0,
          left: 0
        };
        //const first
        return {
          start: ({ pointer, event })=>{
            //event.preventDefault();
            initialScroll.top = element.scrollTop;
            initialScroll.left = element.scrollLeft;
          },
          move: ({ pointer })=>{
            element.scrollTop = initialScroll.top - pointer.offsetY;
            element.scrollLeft = initialScroll.left - pointer.offsetX;
            this.updateViewport();
          }
        };
      });
    }
    
    nextTick(()=>{
      this.updateViewport();
    });
  }
};
</script>
<style lang="scss">
  .v-pado-screen {
    display:inline-block;
    background-color:#eee;
    position:relative;
    overflow:auto;

    > .v-pado-screen-content {
      display: table;
      min-width: 100%;
    }
    
    img {
      display:inline-block;
    }
  }
</style>

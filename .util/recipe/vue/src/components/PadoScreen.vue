<template>
  <div class="v-pado-screen" :style="rectStyle">
    <div class="v-pado-screen-content" :style="innerRectStyle"><slot></slot></div>
  </div>
</template>
<script>
import { getElementTransform, dragHelper } from '../../../../../.src/web';
import { limitNumber } from '../../../../../.src/functions';
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
    viewport: {
      type: Object
    },
    padding: {
      default: 0
    },
    scrollStyle: {
      default: "drag"
    },
    scrollWidth: {
      type   : Number,
      default: undefined
    },
    scrollHeight: {
      type   : Number,
      default: undefined
    }
  },
  data: ()=>({
    scrollLeft: 0,
    scrollTop : 0
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
    innerRectStyle (){
      const paddingValue = parseInt(this.padding, 10);
      const scrollLeft = this.scrollLeft;
      const scrollTop = this.scrollTop;
      
      const style = {
        "transform": `translate(${paddingValue - scrollLeft}px, ${paddingValue - scrollTop}px)`
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
  watch :{
    "viewport.left" (newValue){
      typeof newValue === "number" && (this.scrollLeft = newValue);
    },
    "viewport.top" (newValue){
      typeof newValue === "number" && (this.scrollTop = newValue);
    }
  },
  methods: {
    updateScrollBoundings (){
      if(!this.viewport){ this.viewport = {}; }
      const contentElement = this.$el.querySelector(".v-pado-screen-content");
      const paddingValue = parseInt(this.padding, 10);

      this.$set(this.viewport, "contentWidth", contentElement.offsetWidth);
      this.$set(this.viewport, "contentHeight", contentElement.offsetHeight);
      this.$set(this.viewport, "contentPadding", paddingValue);
    },
    updateViewport (){
      this.hasViewport && nextQueue(()=>{
        const { offsetWidth, offsetHeight } = this.$el;
        this.$set(this.viewport, "left", this.scrollLeft);
        this.$set(this.viewport, "top", this.scrollTop);
        this.$set(this.viewport, "width", offsetWidth);
        this.$set(this.viewport, "height", offsetHeight);
      }, 10);
    }
  },
  mounted (){
    const element = this.$el;
    
    
    if(this.scrollStyle === "drag"){
      dragHelper(this.$el, ()=>{
        const initialScrollVariant = {
          top    : 0,
          left   : 0,
          topMin : 0,
          topMax : 0,
          leftMin: 0,
          leftMax: 0
        };
        
        //const first
        return {
          start: ({ pointer, event })=>{
            //const { translate:{ x:left, y:top } } = getElementTransform(element);
            initialScrollVariant.left = this.scrollLeft;
            initialScrollVariant.top = this.scrollTop;
            //
            
            this.updateScrollBoundings();
            const paddingGap = this.viewport.contentPadding * 2;
            
            initialScrollVariant.leftMax = limitNumber(
              this.viewport.contentWidth - element.offsetWidth + paddingGap,
              Number.POSITIVE_INFINITY,
              0
            );
            
            initialScrollVariant.topMax = limitNumber(
              this.viewport.contentHeight - element.offsetHeight + paddingGap,
              Number.POSITIVE_INFINITY,
              0
            );
          },
          move: ({ pointer })=>{
            this.scrollLeft = limitNumber(
              initialScrollVariant.left - pointer.offsetX,
              initialScrollVariant.leftMax,
              initialScrollVariant.leftMin
            );
            this.scrollTop = limitNumber(
              initialScrollVariant.top - pointer.offsetY,
              initialScrollVariant.topMax,
              initialScrollVariant.topMin
            );
            this.updateViewport();
          }
        };
      });
    }
    
    nextTick(()=>{
      this.updateScrollBoundings();
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
      transform: translate(0px, 0px);
    }
    
    img {
      display:inline-block;
    }
  }
</style>

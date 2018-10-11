<template>
  <div class="v-pado-screen" :style="rectStyle">
    <div class="v-pado-screen-content" :style="innerRectStyle"><slot></slot></div>
  </div>
</template>
<script>
import { dragHelper } from '@sepalang/pado/web';
import { limitNumber } from '@sepalang/pado/functions';
import { nextTick, nextQueue } from '@/utils';
import HighOrderRect from '@sepalang/logic/vue/Rect';

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
    contentWidth  : 0,
    contentHeight : 0,
    contentPadding: 0,
    scrollLeft    : 0,
    scrollTop     : 0,
    screenWidth   : 0,
    screenHeight  : 0
  }),
  computed: {
    viewport: {
      get (){
        const contentPadding = parseInt(this.padding, 10);
        const { scrollLeft, scrollTop, screenWidth, screenHeight, contentWidth, contentHeight } = this;
        const viewport = { 
          left  : scrollLeft, 
          top   : scrollTop, 
          width : screenWidth, 
          height: screenHeight, 
          contentWidth, 
          contentHeight, 
          contentPadding
        };
        
        return viewport;
      },
      set (newValue){
        if(typeof newValue === "object"){
          typeof newValue.contentWidth === 'number' && (this.contentWidth = newValue.contentWidth);
          typeof newValue.contentHeight === 'number' && (this.contentHeight = newValue.contentHeight);
          typeof newValue.contentPadding === 'number' && (this.contentPadding = newValue.contentPadding);
          typeof newValue.left === 'number' && (this.scrollLeft = newValue.left);
          typeof newValue.top === 'number' && (this.scrollTop = newValue.top);
          typeof newValue.width === 'number' && (this.screenWidth = newValue.width);
          typeof newValue.height === 'number' && (this.screenHeight = newValue.height);
        }
      }
    },
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
    }
  },
  methods: {
    updateScrollBoundings (){
      const contentElement = this.$el.querySelector(".v-pado-screen-content");
      this.contentWidth = contentElement.offsetWidth;
      this.contentHeight = contentElement.offsetHeight;
    },
    updateScreenBoundings (){
      nextQueue(()=>{
        const { offsetWidth, offsetHeight } = this.$el;
        this.screenWidth = offsetWidth;
        this.screenHeight = offsetHeight;
      }, 10);
    }
  },
  mounted (){
    const element = this.$el;
    
    if(this.scrollStyle === "drag"){
      dragHelper(this.$el, ()=>{
        const initialScrollVariant = {
          top : 0,
          left: 0
        };
        
        const limitValues = {
          topMin : 0,
          topMax : 0,
          leftMin: 0,
          leftMax: 0
        };
        
        //const first
        return {
          start: ({ pointer, event })=>{
            initialScrollVariant.left = this.scrollLeft;
            initialScrollVariant.top = this.scrollTop;
            //
            
            this.updateScrollBoundings();
            const paddingGap = this.viewport.contentPadding * 2;
            
            limitValues.leftMax = limitNumber(
              this.viewport.contentWidth - element.offsetWidth + paddingGap,
              Number.POSITIVE_INFINITY,
              0
            );
            
            limitValues.topMax = limitNumber(
              this.viewport.contentHeight - element.offsetHeight + paddingGap,
              Number.POSITIVE_INFINITY,
              0
            );
          },
          move: ({ pointer })=>{
            this.scrollLeft = limitNumber(
              initialScrollVariant.left - pointer.offsetX,
              limitValues.leftMax,
              limitValues.leftMin
            );
            this.scrollTop = limitNumber(
              initialScrollVariant.top - pointer.offsetY,
              limitValues.topMax,
              limitValues.topMin
            );
            this.updateScreenBoundings();
          }
        };
      });
    }
    
    nextTick(()=>{
      this.updateScrollBoundings();
      this.updateScreenBoundings();
    });
  }
};
</script>
<style lang="scss">
  .v-pado-screen {
    display:inline-block;
    background-color:transparent;
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
    
    &[debug] {
      border:1px solid blue;
    }
  }
</style>

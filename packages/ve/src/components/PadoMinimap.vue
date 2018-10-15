<template>
  <div class="v-pado-minimap" :style="rectStyle">
    <div class="v-pado-minimap-viewport" :style="viewportStyle">
      <div class="v-pado-minimap-view" :style="viewStyle">
        <slot :ratio="viewportRatio"></slot>
      </div>
    </div>
    <div class="v-pado-minimap-port" :style="portStyle"></div>
  </div>
</template>
<script>
import { limitNumber, top } from '@sepalang/pado/functions';
import { dragHelper } from '@sepalang/logic/web';
import { rect } from '@sepalang/pado/modules/stance';
import { nextTick } from '@/utils';
import HighOrderRect from '@sepalang/logic/vue/Rect';

export default {
  mixins: [
    HighOrderRect([['width', 'height', 'size', 'rect'], ['auto', 'auto']])
  ],
  props: {
    screenRef: {
      default: undefined
    },
    autoscale: {
      default: false
    }
  },
  data: ()=>({
    viewport: undefined
  }),
  computed: {
    screenVariant (){
      const viewport = typeof this.viewport === 'object' && (this.viewport['viewport'] || this.viewport);
      const { width, height } = this.rectValue;
      
      const computed = {
        contentPadding: 0,
        contentWidth  : 0,
        contentHeight : 0,
        top           : 0,
        left          : 0,
        width         : width,
        height        : height
      };
      
      if(typeof this.viewport === "object"){
        typeof viewport['contentPadding'] === 'number' && (computed['contentPadding'] = viewport['contentPadding']);
        typeof viewport['contentWidth'] === 'number' && (computed['contentWidth'] = viewport['contentWidth']);
        typeof viewport['contentHeight'] === 'number' && (computed['contentHeight'] = viewport['contentHeight']);
        typeof viewport['top'] === 'number' && (computed['top'] = viewport['top']);
        typeof viewport['left'] === 'number' && (computed['left'] = viewport['left']);
        typeof viewport['width'] === 'number' && (computed['width'] = viewport['width']);
        typeof viewport['height'] === 'number' && (computed['height'] = viewport['height']);
      }
      
      return computed;
    },
    viewportElementRect (){
      const { width:masterWidth, height:masterHeight } = this.rectValue;
      const { contentWidth, contentHeight }  = this.screenVariant;
      const masterRect = { left: 0, top: 0, width: masterWidth, height: masterHeight };
      return rect(0, 0, contentWidth, contentHeight).fit(masterRect).sticky(masterRect, 'center').toJSON();
    },
    originalScrollConentRect (){
      const { contentWidth, contentHeight, contentPadding } = this.screenVariant;
      return {
        width : (contentWidth + (contentPadding * 2)),
        height: (contentHeight + (contentPadding * 2))
      };
    },
    viewportRatio (){
      const { width:viewportWidth, height:viewportHeight } = this.viewportElementRect;
      const { width:contentWidth, height:contentHeight } = this.originalScrollConentRect;
      const result = top([viewportWidth / contentWidth, viewportHeight / contentHeight], false);
      return result || 0;
    },
    rectStyle (){
      const { width, height } = this.rectValue;
      const [left, top] = [this.left + 'px', this.top + 'px'];
      return { width: width + 'px', height: height + 'px', left, top};
    },
    
    viewportStyle (){
      const { left, top, width, height } = this.viewportElementRect;
      
      return {
        left  : `${left}px`,
        top   : `${top}px`,
        width : `${width}px`,
        height: `${height}px`
      };
    },
    viewStyle (){
      const style = {
        transform: `translate(-50%, -50%) scale(1)`,
        left     : `50%`,
        top      : `50%`
      };
      return style;
    },
    portStyle (){
      const viewportRatio = this.viewportRatio;
      const { left:viewportLeft, top:viewportTop } = this.viewportElementRect;
      let { left:scrollLeft, top:scrollTop, width:scrollWidth, height:scrollHeight } = this.screenVariant;
      
      scrollLeft *= viewportRatio;
      scrollTop *= viewportRatio;
      scrollWidth *= viewportRatio;
      scrollHeight *= viewportRatio;
      scrollLeft += viewportLeft;
      scrollTop += viewportTop;

      const style = {
        left  : `${scrollLeft}px`,
        top   : `${scrollTop}px`,
        width : `${scrollWidth}px`,
        height: `${scrollHeight}px`
      };
      
      return style;
    }
  },
  beforeMount (){
    let currentRef;
    
    this.$unwatchViewport = undefined;
    this.$unwatchScreenRef = this.$watch('screenRef', (ref)=>{
      currentRef = ref;
      
      if(typeof ref !== "object"){
        return;
      }

      this.$unwatchViewport && this.$unwatchViewport();
      this.$unwatchViewport = this.$watch(()=>ref['viewport'], (viewport)=>{
        this.viewport = viewport;
      });
    });
    
    this.$sendViewport = function (send){
      if(currentRef){
        currentRef['viewport'] = send;
      }
    };
  },
  mounted (){
    nextTick(()=>{
      const portElement = this.$el.querySelector(".v-pado-minimap-port");
    
      dragHelper(portElement, ({ element:dragElement })=>{
        const startPosition = {
          top : 0,
          left: 0
        };
      
        return {
          start: ()=>{
            let { left, top } = this.screenVariant;
            startPosition.left = left;
            startPosition.top = top;
          },
          move: ({ pointer })=>{
            const boostX = pointer.offsetX * (1 / this.viewportRatio);
            const boostY = pointer.offsetY * (1 / this.viewportRatio);
            
            let { width:viewportWidth, height:viewportHeight } = this.screenVariant;
            let { width:contentWidth, height:contentHeight } = this.originalScrollConentRect;
            
            let { destLeft:left, destTop:top } = {
              destLeft: parseInt(limitNumber(
                startPosition.left + boostX,
                contentWidth - viewportWidth,
                0
              ), 10),
              destTop: parseInt(limitNumber(
                startPosition.top + boostY,
                contentHeight - viewportHeight,
                0
              ), 10)
            };
            
            this.$sendViewport({ left, top });
          }
        };
      });
    });
  },
  destroyed (){
    this.$unwatchScreenRef();
    this.$unwatchViewport && this.$unwatchViewport();
  }
};
</script>
<style lang="scss">
  .v-pado-minimap {
    display:inline-block;
    position:relative;
    overflow:hidden;
    
    > .v-pado-minimap-viewport {
      position:relative;
      pointer-events:none;
      
      > .v-pado-minimap-view {
        position:absolute;
        display:inline-block;
        > * {
          left:0px;
          top:0px;
        }
      }
    }
    
    > .v-pado-minimap-port {
      pointer-events:all;
      background: #65ff00;
      border: 1px solid #65ff00;
      opacity: 0.4;
      position:absolute;
      top:0;
      left:0;
    }
    
    img {
      display:inline-block;
    }
    
    &.debug {
      border:1px solid red;
      
      > .v-pado-minimap-viewport {
        border:1px solid green;
        
        > .v-pado-minimap-view {
          border:1px solid purple;
        }
      }
      
      > .v-pado-minimap-port {
        border:1px solid blue;
      }
    }
  }
  
  
</style>

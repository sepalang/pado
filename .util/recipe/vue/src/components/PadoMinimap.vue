<template>
  <div class="v-pado-minimap" :style="rectStyle">
    <div class="v-pado-minimap-viewport" :style="viewportStyle">
      <div class="v-pado-minimap-view" :style="viewStyle"><slot></slot></div>
    </div>
    <div class="v-pado-minimap-port" :style="portStyle"></div>
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
    viewport: {
      require: true,
      type   : Object
    },
    autoscale: {
      default: false
    }
  },
  data: ()=>({
    readyEl: false
  }),
  computed: {
    rectStyle (){
      const { width, height } = this.rectValue;
      const [left, top] = [this.left + 'px', this.top + 'px'];
      return { width: width + 'px', height: height + 'px', left, top};
    },
    viewportBoundings (){
      const padding = (this.viewport.contentPadding || 0);
      const contentWidth = (this.viewport.contentWidth || 0);
      const contentHeight = (this.viewport.contentHeight || 0);
      return {
        padding,
        contentWidth,
        contentHeight
      };
    },
    viewportRatio (){
      const { width:masterWidth, height:masterHeight } = this.rectValue;
      const { padding, contentWidth, contentHeight } = this.viewportBoundings;
      return top([masterWidth / (contentWidth + (padding * 2)), masterHeight / (contentHeight + (padding * 2))], false);
    },
    viewportVariant (){
      if(typeof this.viewport !== "object"){
        return {
          contentPadding: 0,
          width         : 10,
          height        : 10
        };
      }
      
      return {
        top   : this.viewport.top,
        left  : this.viewport.left,
        width : this.viewport.width,
        height: this.viewport.height
      };
    },
    viewportStyle (){
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
    viewStyle (){
      const { padding } = this.viewportBoundings;
      const style = {
        'left'          : `${padding}px`,
        'top'           : `${padding}px`,
        'padding-right' : `${padding}px`,
        'padding-bottom': `${padding}px`
      };
      
      if(this.autoscale === false){
        const reverseRatio = 1 / this.viewportRatio;
        style.transform = `scale(${reverseRatio})`;
      }
      
      return style;
    },
    portStyle (){
      const viewportRatio = this.viewportRatio;
      
      const { width:minimapWidth, height:minimapHeight } = this.rectValue;
      let { contentWidth, contentHeight } = this.viewportBoundings;
      let { left:portLeft, top:portTop, width:portWidth, height:portHeight } = this.viewportVariant;
      
      portLeft = portLeft * viewportRatio;
      portTop = portTop * viewportRatio;
      portWidth = portWidth * viewportRatio;
      portHeight = portHeight * viewportRatio;
      contentWidth = contentWidth * viewportRatio;
      contentHeight = contentHeight * viewportRatio;
      
      
      const style = {
        left  : `${((minimapWidth - contentWidth) / 2) + portLeft}px`,
        top   : `${((minimapHeight - contentHeight) / 2) + portTop}px`,
        width : `${portWidth}px`,
        height: `${portHeight}px`
      };
      
      return style;
    }
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
            let { left, top } = this.viewportVariant;
            startPosition.left = left;
            startPosition.top = top;
          },
          move: ({ pointer })=>{
            const boostX = pointer.offsetX * (1 / this.viewportRatio);
            const boostY = pointer.offsetY * (1 / this.viewportRatio);
            
            let { width:viewportWidth, height:viewportHeight } = this.viewportVariant;
            let { contentWidth, contentHeight } = this.viewportBoundings;
            
            let { destLeft:left, destTop:top } = {
              destLeft: limitNumber(
                startPosition.left + boostX,
                contentWidth - viewportWidth,
                0
              ),
              destTop: limitNumber(
                startPosition.top + boostY,
                contentHeight - viewportHeight,
                0
              )
            };
            
            if(typeof this.viewport !== "object"){
              this.$set(this, "viewport", {});
            }
            this.$set(this.viewport, "left", parseInt(left, 10));
            this.$set(this.viewport, "top", parseInt(top, 10));
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
    overflow:hidden;

    > .v-pado-minimap-viewport {
      position:absolute;
      
      * {
        pointer-events:none;
      }
      
      > .v-pado-minimap-view {
        position:relative;
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
  }
</style>

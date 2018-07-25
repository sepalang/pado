<template>
  <div class="v-pado-minimap" :style="rectStyle">
    <div class="v-pado-minimap-viewport" :style="viewportStyle">
      <div class="v-pado-minimap-view" :style="viewStyle"><slot></slot></div>
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
    viewport: {
      require: true,
      type   : Object
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
        transform: `translate(-50%, -50.1%) scale(${viewportRatio})`,
        left     : `50%`,
        top      : `50%`
      };
      
      return style;
    },
    viewStyle (){
      const { padding } = this.viewportBoundings;
      return {
        'left'          : `${padding}px`,
        'top'           : `${padding}px`,
        'padding-right' : `${padding}px`,
        'padding-bottom': `${padding}px`
      };
    },
    portStyle (){
      const { left:portLeft, top:portTop, width:portWidth, height:portHeight } = this.viewportVariant;
      
      const style = {
        left  : `${portLeft}px`,
        top   : `${portTop}px`,
        width : `${portWidth}px`,
        height: `${portHeight}px`
      };
      
      return style;
    }
  },
  mounted (){
    nextTick(()=>{
      const viewElement = this.$el.querySelector(".v-pado-minimap-viewport");
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
            const boostX = pointer.offsetX * (1 / this.viewportRatio);
            const boostY = pointer.offsetY * (1 / this.viewportRatio);
            
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

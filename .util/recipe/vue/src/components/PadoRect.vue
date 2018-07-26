<template>
  <span class="v-pado-rect" :style="rectStyle">
    <span><slot :rect="rectStyle">{{ contentValue }}</slot></span>
  </span>
</template>
<script>
import { isPresence } from '../../../../../.src/functions';
import { dragHelper, getElementBoundingRect } from '../../../../../.src/web';
import { nextQueue } from '@/service';
import HighOrderRect from './mixins/HighOrderRect';
import HighOrderPoint from './mixins/HighOrderPoint';

export default {
  mixins: [
    HighOrderRect([['width', 'height', 'size', 'rect'], [20, 20]]),
    HighOrderPoint([['left', 'top', 'point'], [0, 0]])
  ],
  props: {
    label   : {},
    dragmove: {}
  },
  computed: {
    contentValue (){
      const { width, height } = this.rectValue;
      return typeof this.label === 'string' ? this.label : `${width}x${height}`;
    },
    rectStyle (){
      const { width, height } = this.rectValue;
      const position = (this.left > 0 || this.top > 0) ? 'absolute' : 'relative';
      const [left, top] = [this.left + 'px', this.top + 'px'];
      return { width: width + 'px', height: height + 'px', position, left, top};
    },
    changeBoundsWatchGroup (){
      this.$el && nextQueue(()=>{
        const boundingRect = getElementBoundingRect(this.$el);
        if(boundingRect.valid !== false) this.$emit('bounding', boundingRect);
      });
      return [this.size, this.left, this.top].length;
    }
  },
  watch: {
    changeBoundsWatchGroup (newValue){}
  },
  mounted (){
    const boundingRect = getElementBoundingRect(this.$el);
    if(boundingRect.valid !== false) this.$emit('bounding', getElementBoundingRect(this.$el));

    if(isPresence(this.dragmove)){
      dragHelper(this.$el, ({ element })=>{
        const startOffset = this.pointValue;
        const positionWithOffset = function (x, y){
          const result = {
            left: startOffset.left + x,
            top : startOffset.top + y
          };
          element.css(result);
          return result;
        };

        return {
          move: ({ pointer: { offsetX, offsetY } })=>{
            const result = positionWithOffset(offsetX, offsetY);
            this.$emit('drawPoint', result);
          },
          end: ({ pointer: { offsetX, offsetY } })=>{
            const result = positionWithOffset(offsetX, offsetY);
            this.$emit('inputPoint', result);
          }
        };
      });
    }
  }
};
</script>
<style lang="scss">
  .v-pado-rect {
    display:inline-block;
    background-color:#eee;
    position:relative;

    > span {
      display:inline-block;
      font-size:10px;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      word-break:keep-all;
      white-space: nowrap;
      text-shadow:0px 0px 2px rgba(0,0,0,.5);
      color:gray;
    }

    &[theme="frame"]{
      background-color:transparent;
      border:1px dashed gray;
    }
    
    &[theme="selectable"]{
      &:hover {
        
      };
      &[selected] {
        
      };
    }

  }
</style>

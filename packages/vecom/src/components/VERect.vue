<template>
  <span class="ve-rect" :mixins="mixins" :style="rectStyle">
    <template v-if="hasMixins('print')">
      <span>
        <slot :rect="rectStyle">{{ contentValue }}</slot>
      </span>
    </template>
    <template v-else>
      <slot :rect="rectStyle">{{ contentValue }}</slot>
    </template>
  </span>
</template>
<script>
import { dragHelper, getElementBoundingRect, nodeCss } from '@sepalang/logic/web';
import { nextQueue } from '@/utils';
import HighOrderRect from '@sepalang/logic/vue/Rect';
import HighOrderPoint from '@sepalang/logic/vue/Point';
import HighOrderMultipleValue from '@sepalang/logic/vue/MultipleValue';

export default {
  mixins: [
    HighOrderMultipleValue(['mixins']),
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
      const labelValue = this.label;
      const printMode = this.hasMixins('print');
      return typeof labelValue === 'string' ? labelValue : printMode ? `${width}x${height}` : '';
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

    dragHelper(this.$el, ({ element })=>{
      const startOffset = this.pointValue;
      const positionWithOffset = function (x, y){
        const result = {
          left: startOffset.left + x,
          top : startOffset.top + y
        };
        
        nodeCss(element, result);
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
};
</script>
<style lang="scss">
  .ve-rect {
    display:inline-block;
    position:relative;
    
    &[mixins~="block"] {
      display:block;
    }
    
    &[mixins~="line"] {
      border:1px solid #ddd;
    }
    
    &[mixins~="bg"] {
      background-color:#eee;
    }
    
    &[mixins~="print"] {
      background-color:#eee;
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
    }
    
    &[mixins~="frame"]{
      background-color:transparent;
      border:1px dashed gray;
    }
    
  }
</style>

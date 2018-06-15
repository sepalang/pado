<template>
  <span class="pado-rect" :style="styleValue">
    <span class="pado-rect-description">{{ contentValue }}</span>
  </span>
</template>
<script>
  import $ from '../../../../.src/web/plugins/jquery';
  import { domainRangeValue, drawCircleVars, likeNumber, isPresence } from '../../../../.src/functions';
  import { dragHelper, getElementBoundingRect } from '../../../../.src/web';

  export default {
    props: {
      width:{default:20},
      height:{default:20},
      size:{},
      left:{default:0},
      top:{default:0},
      dragmove:{}
    },
    computed:{
      pointValue (){
        return {
          left:parseInt(this.left, 10),
          top:parseInt(this.top, 10)
        }
      },
      sizeValue (){
        return likeNumber(this.size) ? parseFloat(this.size) : undefined;
      },
      rectValue (){
        const width  = typeof this.sizeValue === "number" ? this.sizeValue : parseInt(this.width, 10);
        const height = typeof this.sizeValue === "number" ? this.sizeValue : parseInt(this.height, 10);
        return { width, height };
      },
      contentValue (){
        const { width, height } = this.rectValue;
        return `${width}x${height}`
      },
      styleValue (){
        const { width, height } = this.rectValue;
        const position = (this.left > 0 || this.top > 0) ? "absolute" : "relative";
        const [left, top] = [this.left+"px", this.top+"px"];
        return { width:width + "px", height:height + "px", position,left,top};
      },
      changeBoundsWatchGroup (){
        this.$el && setTimeout(()=>{
          const boundingRect = getElementBoundingRect(this.$el);
          if(boundingRect.valid !== false) this.$emit("bounding",boundingRect);
        });
        return [this.size, this.left, this.top].length;
      }
    },
    watch: {
      changeBoundsWatchGroup (newValue){}
    },
    mounted (){
      const boundingRect = getElementBoundingRect(this.$el);
      if(boundingRect.valid !== false) this.$emit("bounding",getElementBoundingRect(this.$el));
      
      if(isPresence(this.dragmove)){
        dragHelper(this.$el,({ element })=>{
          
          const startOffset = this.pointValue;
          const positionWithOffset = function(x, y){
            const result = {
              left:startOffset.left + x,
              top:startOffset.top  + y
            };
            element.css(result);
            return result;
          }
          
          return {
            move:({ pointer:{ offsetX, offsetY } })=>{
              const result = positionWithOffset(offsetX, offsetY)
              this.$emit("drawPoint",result);
            },
            end:({ pointer:{ offsetX, offsetY } })=>{
              const result = positionWithOffset(offsetX, offsetY);
              this.$emit("inputPoint",result);
            }
          }
        });
      }
    }
  }
  </script>
</script>
<style lang="scss">
  .pado-rect {
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
  }
</style>
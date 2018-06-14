<template>
  <span class="pado-rect" :style="styleValue">
    <span class="pado-rect-description">{{ contentValue }}</span>
  </span>
</template>
<script>
  import $ from '../../../../.src/web/plugins/jquery';
  import { dragHelper } from '../../../../.src/web/index';
  import { domainRangeValue, drawCircleVars } from '../../../../.src/functions';
  import { getElementBoundingRect } from '../../../../.src/web';

  export default {
    props: {
      width:{
        default:20
      },
      height:{
        default:20
      },
      size:{},
      left:{
        default:0
      },
      top:{
        default:0
      }
    },
    computed:{
      rectValue (){
        const width  = typeof this.size === "number" ? this.size : this.width;
        const height = typeof this.size === "number" ? this.size : this.height;
        return { width, height };
      },
      contentValue (){
        const { width, height } = this.rectValue;
        return `${width}x${height}`
      },
      styleValue (){
        const { width, height } = this.rectValue;
        const poistion = (this.left > 0 || this.top > 0) ? "absolute" : "relative";
        const [left, top] = [this.left+"px", this.top+"px"];
        return { width:width + "px", height:height + "px", poistion,left,top};
      },
      changeBoundsWatchGroup (){
        this.$el && setTimeout(()=>{
          this.$emit("bounding",getElementBoundingRect(this.$el));
        });
        return [this.size, this.left, this.top].length;
      }
    },
    watch: {
      changeBoundsWatchGroup (newValue){}
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
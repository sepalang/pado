<template>
  <span :style="rectStyle"></span>
</template>
<script>
import HighOrderRect from './mixins/HighOrderRect';

export default {
  mixins:[ HighOrderRect() ],
  props: {
  },
  computed: {
    rectStyle:function(){
      console.log("xy this.rectValue",this.rectValue,this.sizeValue);
      
      return {};
    }
  }
}
</script>
<template>
  <div class="main">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: {
      
    }
  }
</script>
<style lang="scss">
  @import '../util/scss/layout.scss';
  
  dd+dt {
    margin-top:20px;
  }
  dd {
    margin-left:20px;
  }
  
</style>

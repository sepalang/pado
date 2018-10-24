<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  mounted(){
    const allFunctions = require('@sepalang/pado');
    Object.assign(window, allFunctions);
  }
}
</script>

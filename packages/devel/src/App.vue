<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  mounted(){
    const a = require('@sepalang/pado');
    const cast = require('@sepalang/pado/functions/cast.spec.js');
    const remark = require('@sepalang/pado/functions/remark.spec.js');
    Object.assign(window, { a, cast, remark });
  }
}
</script>

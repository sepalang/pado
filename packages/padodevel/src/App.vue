<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  mounted(){
    const { omitOf, omit } = require('@sepalang/pado/functions');
    
    Object.assign(window, {
      omitOf,
      omit
    })
    
  }
}
</script>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  
import { omit } from '@sepalang/pado/functions';

export default {
  mounted(){
    console.log('functions', omit);
  }
}
</script>

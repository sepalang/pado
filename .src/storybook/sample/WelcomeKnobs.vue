<template>
  <div class="main">
    <h1>Knobs property</h1>
    <pre>{{ JSON.stringify(knobs,2,2) }}</pre>
    
  </div>
</template>

<script>
  export default {
    props: ["knobs"]
  }
</script>

<style>

</style>

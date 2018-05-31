<template>
  <div class="main">
    <h1>Pado storybook</h1>
    <dl>
      <dt>GIT</dt>
      <dd><a href="https://github.com/sepalang/pado" target="_blank">sepalang/pado</a></dd>
      
      <dt>Feature</dt>
      <dd>Functions</dd>
      <dd>Modules</dd>
      <dd>Hacks</dd>
      
      <dt>Advence</dt>
      <dd>How use to visual programming</dd>
      
    </dl>
  </div>
</template>

<script>
  export default {
    props: {
      goToButton: {
        default: () => () => null
      },
    }
  }
</script>
<style>
  dd+dt {
    margin-top:20px;
  }
  dd {
    margin-left:20px;
  }
</style>
<template>
  <div id="master-layout">
    <header>
      <menu>
        <li><router-link to="/transform">Transform</router-link></li>
        <li><router-link to="/svg">SVG</router-link></li>
      </menu>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>
<script>
export default {
  props: {
    
  }
}
</script>
<style lang="scss">
  #master-layout {
    > header {
      margin:10px;
    }
    > main {
      margin:20px;
    }
  }
</style>
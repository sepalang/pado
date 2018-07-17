<template>
  <div id="master-layout">
    <header>
      <menu>
        <li><router-link to="/main">Main</router-link></li>
        <li><router-link to="/tree">Tree</router-link></li>
        <li><router-link to="/grid">Grid</router-link></li>
        <li><router-link to="/transform">Transform</router-link></li>
        <li><router-link to="/svg">SVG</router-link></li>
        <li><router-link to="/panel">Panel</router-link></li>
        <li><router-link to="/tab">Tab</router-link></li>
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
};
</script>
<style lang="scss">
@import '@/assets/scss/app.scss'
</style>

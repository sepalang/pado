<template>
  <div class="master-layout">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/idc">idc</router-link>
    </div>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    msg: String
  }
};
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

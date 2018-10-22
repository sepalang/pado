<template>
  <span class="v-radio" @click="input()">
    <input type="radio" :checked="isChecked" readOnly>
    <span><slot></slot></span>
  </span>
</template>
<script>
import HighOrderRadio from '@sepalang/logic/vue/Radio.js';
export default {
  mixins: [ HighOrderRadio() ]
};
</script>
<style lang="scss">
.v-radio {
  cursor:pointer;
}
</style>

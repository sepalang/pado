<template>
  <span class="v-checkbox" @click="input()">
    <input type="checkbox" :checked="isChecked" readOnly>
    <span><slot></slot></span>
  </span>
</template>
<script>
import HighOrderCheckbox from '@sepalang/logic/vue/Checkbox.js';
export default {
  mixins: [ HighOrderCheckbox() ]
};
</script>
<style lang="scss">
.v-checkbox {
  cursor:pointer;
}
</style>

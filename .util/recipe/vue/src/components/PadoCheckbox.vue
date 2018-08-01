<template>
  <span class="v-checkbox" @click="input()">
    <input type="checkbox" v-model="isChecked" readOnly>
    <span>{{isMultiple}}<slot></slot></span>
  </span>
</template>
<script>
import HighOrderCheckbox from './mixins/HighOrderCheckbox.js';
export default {
  mixins: [ HighOrderCheckbox() ]
};
</script>
<style lang="scss">
.v-checkbox {
  cursor:pointer;
}
</style>

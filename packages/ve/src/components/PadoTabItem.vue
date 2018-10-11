<template>
  <li class="v-tab-item">
    <slot></slot>
  </li>
</template>
<script>
import HighOrderSelectOption from '@sepalang/logic/vue/SelectOption';
export default {
  mixins: [ HighOrderSelectOption() ]
};
</script>

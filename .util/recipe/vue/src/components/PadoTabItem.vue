<template>
  <li class="v-tab-item">
    <slot></slot>
  </li>
</template>
<script>
import HighOrderSelectOption from './mixins/HighOrderSelectOption'
export default {
  mixins: [ HighOrderSelectOption() ]
}
</script>

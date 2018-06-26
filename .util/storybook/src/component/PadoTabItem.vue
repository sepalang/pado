<template>
  <li class="v-tab-item">
    <slot></slot>
  </li>
</template>
<script>
import HighOrderSelectItem from './mixins/HighOrderSelectItem';
export default {
  mixins:[ HighOrderSelectItem() ]
}
</script>
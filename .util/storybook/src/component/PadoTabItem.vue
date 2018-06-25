<template>
  <li class="v-tab-item">
    <slot></slot>
  </li>
</template>
<script>
import SelectItemInterface from './mixins/SelectItemInterface';
export default {
  mixins:[ SelectItemInterface ]
}
</script>
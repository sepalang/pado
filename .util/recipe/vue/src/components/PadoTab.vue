<template>
  <ul class="v-tab">
    <slot></slot>
  </ul>
</template>
<script>
import HighOrderSelect from './mixins/HighOrderSelect';

export default {
  mixins:[ HighOrderSelect() ]
};
</script>
<style lang="scss">
  .v-tab {
    list-style:none;
    padding:0;
    margin:0;
    border-bottom:1px solid #eee;

    &:after {
      content:"";
      display:block;
      height:0px;
      width:0px;
      clear:both;
    }

    .v-tab-item {
      display:inline-block;
      border:1px solid #eee;
      padding:0 10px;
      height:20px;
      line-height:20px;
      font-size:12px;
      color:#aaa;
      float:left;
      cursor:pointer;
      background-color:#f6f6f6;
      &:hover {
        color:#888;
        background-color:#fafafa;
      }
      &[selected]{
        color:black;
        background-color:white;
      }
      + .v-tab-item {
        margin-left:-1px;
      }
    }
  }
</style>

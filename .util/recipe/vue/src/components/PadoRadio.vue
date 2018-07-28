<template>
  <span class="v-radio">
    <input type="radio" :selected="isChecked" readOnly>
    <span>{{isChecked}}<slot></slot></span>
  </span>
</template>
<script>
export default {
  computed: {
    isChecked (){
      return false;
    }
  }
};
</script>
<style lang="scss">
.v-radio {
  
}
</style>

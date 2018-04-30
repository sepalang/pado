<template>
  <div>
    <label>
      HI
      <input type="select">
    </label>
  </div>
</template>

<script>
  export default {
    props: ["knobs"],
    computed:{
      knobsData (){
        return [];
      }
    }
  }
</script>
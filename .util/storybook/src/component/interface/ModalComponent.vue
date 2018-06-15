<template>
  <div role="modal">
    <slot></slot>
  </div>
</template>
<script>
import $ from 'jquery';
import LinkComponent from '../mixins/LinkComponent';

export default {
  mixins:[ LinkComponent ],
  methods: {
    close:async function() {
      const closeResult = await this.$link.dispatch("close");
      if(closeResult.some(r=>r===false)) return;
      $(this.$el).removeAttr("open");
      this.$destroy();
    }
  },
  mounted:async function() {
    const openResult = await this.$link.dispatch("open");
    if(openResult.some(r=>r===false)) return;
    $(this.$el)
    .attr("open","")
    .on("click",".modal-close-action", ()=>{
      this.close();
    });
  },
  destroyed() {
    $(this.$el).remove();
  }
}
</script>
<style lang="scss">
  [role="modal"] {
    -ms-overflow-style: none;
    position: fixed;
    top: 0;
    right: -18px;
    bottom: 0;
    left: -18px;
    z-index: 9900;
    display: none;
    overflow: hidden;
    outline: 0;
    background-color:rgba(0,0,0,0.65);
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        width: 0 !important;
    }
    &[open] {
        overflow-x: hidden;
        overflow-y: auto;
        display: block;
        >dialog, >[role=dialog] {
            display:block;
        }
    }
    >dialog, >[role=dialog] {
      position: relative;
      margin: 20px auto;
      min-width:200px;
      min-height:40px;
      background-color:white;
      border:none;
    }
  }
</style>
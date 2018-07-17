<template>
  <div role="modal">
    <slot></slot>
  </div>
</template>
<script>
import $ from 'jquery';
import LinkComponent from '../mixins/LinkComponent';
import { getElementBoundingRect } from '../../../../../../.src/web';

export default {
  mixins : [ LinkComponent ],
  mounted: async function (){
    const openResult = await this.$link.dispatch('open');
    if (openResult.some(r=>r === false)) return;

    $(this.$el)
      .attr('open', '')
      .on('click', '.modal-close-action', ()=>{
        this.close();
      });

    this.dialogPosition();
  },
  methods: {
    close: async function (){
      const closeResult = await this.$link.dispatch('close');
      if (closeResult.some(r=>r === false)) return;
      $(this.$el).removeAttr('open');
      this.$destroy();
    },
    dialogPosition (){
      const modalElement = this.$el;
      const dialogElement = this.$el.children[0];
      if (!dialogElement){ return; }

      const { height: modalHeight } = getElementBoundingRect(modalElement);
      const { height: dialogHeight } = getElementBoundingRect(dialogElement);
      let marginTop = ((modalHeight - dialogHeight) / 2) - 20;

      $(dialogElement).css('top', `${marginTop}px`);
    }
  },
  destroyed (){
    $(this.$el).remove();
  }
};
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
      border-radius:5px;
      
      > header {
        padding:10px;
        > b {
          font-size:14px;
        }
      }
      
      > stage {
        font-size:12px;
        padding:10px;
      }
      
      > footer {
        min-height:20px;
        padding:10px;
        font-size:12px;
        > p {
          display:inline-block;
          line-height:20px;
          color:#888;
        }
      } 
    }
  }
</style>

<template>
  <ul class="v-node" v-if="listStyle !== false">
    <li class="v-node-item" v-for="item in model" :key="item[id]" >
      <slot
        :model="item"
        :depth="depth"
        :open="item.$open"
        :selected="item.$selected"
        :checked="item.$checked"
        :children="item[children]"
        :hasChildren="!!(item[children] && item[children].length)"
        :toggleOpen="()=>triggerOpen(item)"
      ></slot>
    </li>
  </ul>
  <div class="v-node" v-else>
    <div class="v-node-item" v-for="item in model" :key="item[id]" >
      <slot
        :model="item"
        :depth="depth"
        :open="item.$open"
        :selected="item.$selected"
        :checked="item.$checked"
        :children="item[children]"
        :hasChildren="!!(item[children] && item[children].length)"
        :toggleOpen="()=>triggerOpen(item)"
      ></slot>
    </div>
  </div>
</template>
<script>
const NodeComponent = {
  props: {
    model: {
      type: Array
    },
    nested: {
      type   : Boolean,
      default: false
    },
    id: {
      default: 'id'
    },
    listStyle: {
      default: false
    },
    // only use nested mode.
    children: {
      default: 'children'
    }
  },
  computed: {
    __vnodecomponent (){
      return true;
    },
    isListStyled (){
      return !!this.listStyle;
    },
    depth (){
      return this.parentNodeComponents().length;
    }
  },
  methods: {
    parentNodeComponents (){
      let result = [];
      let target = this;
      do {
        target = target.$parent;
        target && target.__vnodecomponent && result.push(target);
      } while(target);
      return result;
    },
    findRootComponent (){
      const parents = this.parentNodeComponents();
      return parents[parents.length - 1] || this;
    },
    getId (item, depth){
      return item[this.id];
    },
    triggerOpen (item){
      const destOpenValue = !item.$open;
      this.$set(item, '$open', destOpenValue);
      this.$emit('open', {
        value: destOpenValue,
        model: item
      });
    }
  }
};

NodeComponent.components = { NodeComponent };

export default NodeComponent;
</script>

<template>
  <AppLayout>
    <div>TreePage</div>
    <hr>
    <h2>render</h2>
    <ul v-model="treeModel" is="PadoNode" ref="rootnode" class="foo" :class={bar:true}>
      <template slot-scope="{ model:list, toggleOpen, depth, isOpen, hasChildren }">
        <template v-for="item in list">
          <li :key="item.name+0">
            <button
              @click="toggleOpen(item)"
              :disabled="!hasChildren(item)"
            >{{depth}} OPEN</button>{{ item.name }}
          </li>
          <li v-if="isOpen(item) && hasChildren(item)" :key="item.name+1" style="display:block;">
            <ul v-model="item.children" is="PadoNode">
              <template slot-scope="{ model:list, depth, toggleOpen, hasChildren, toggleSelected }">
                <li v-for="(item, index) in list" :key="item.name" style="display:block;">
                  <input type="checkbox" v-model="item.$selected">
                  <button @click="toggleSelected(item)"></button>
                  [{{depth + ':' + index}}] {{ item.name }}
                  <button
                    @click="toggleOpen(item)"
                    :disabled="!hasChildren(item)"
                  >MORE</button>
                  <div v-if="isOpen(item) && hasChildren(item)" is="PadoNode" v-model="item.children">
                    <template slot-scope="{ model:list, depth, toggleOpen, hasChildren, toggleSelected }">
                      <div v-for="(item ,index) in list" :key="item.name">
                        [{{ depth + ':' + index }}] {{ item.name }}
                      </div>
                    </template>
                  </div>
                </li>
              </template>
            </ul>
          </li>
        </template>
      </template>
    </ul>
    <hr>
    
    <h2>Custom tree</h2>
    <pre>{{ treeModel }}</pre>
    <PadoNodes :model="treeModel">
      <template slot-scope="node">
        <div>
          <button 
            @click="node.toggleOpen" 
            :disabled="!node.model.children || !node.model.children.length"
          >OPEN</button>
          [{{ node.depth }}]
          {{ node.model.name }}
        </div>
        <div v-if="node.open">
          <PadoNodes :model="node.model.children">
            <template slot-scope="node">
              <button
                v-if="node.model.children && node.model.children.length"
                @click="node.toggleOpen" 
              >
                MORE OPEN
              </button>
              [{{ node.depth }}]
              {{ node.model.name }}
              <div v-if="node.open">
                [{{ node.depth + 1 }}]
                {{ node.model.children }}
              </div>
            </template>
          </PadoNodes>
        </div>
      </template>
    </PadoNodes>
    
    <hr>
    
    <h2>Auto tree : incomplete</h2>
    <PadoNodes :model="treeModel" :nested="true">
      <template slot-scope="node">
        <button 
          @click="node.toggleOpen" 
          :disabled="!node.model.children"
        > Open: {{ node.open }}</button>
      </template>
    </PadoNodes>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import PadoNode from '../components/PadoNode.vue';
import PadoNodes from '../components/PadoNodes.vue';

export default {
  components: {
    AppLayout,
    PadoNode,
    PadoNodes
  },
  data: ()=>({
    treeModel: [
      {
        name    : 'foo',
        children: [
          {
            name    : "kim",
            children: [
              { name: "김치" },
              { name: "김밥" }
            ]
          },
          {name: "chi"},
          {name: "foo"},
          {name: "bar"}
        ]
      },
      {name: 'bar'}
    ],
    bgcol: 'yellow'
  }),
  mounted (){
    console.log("rootnode", this.$refs.rootnode);
  }
};
</script>

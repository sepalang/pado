<template>
  <AppLayout>
    <div>TreePage</div>
    <hr>
    <h2>render</h2>
    <div is="PadoNodes" class="asdf" v-if="1===1" :style="{'background-color':bgcol}">
      <li>asdf</li>
    </div>
    <input type="text" v-model="bgcol">
    <hr>
    
    <h2>Custom tree</h2>
    <pre>{{ treeModel }}</pre>
    <PadoNode :model="treeModel">
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
          <PadoNode :model="node.model.children">
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
          </PadoNode>
        </div>
      </template>
    </PadoNode>
    
    <hr>
    
    <h2>Auto tree : incomplete</h2>
    <PadoNode :model="treeModel" :nested="true">
      <template slot-scope="node">
        <button 
          @click="node.toggleOpen" 
          :disabled="!node.model.children"
        > Open: {{ node.open }}</button>
      </template>
    </PadoNode>
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
          {name: "chi"}
        ]
      },
      {name: 'bar'}
    ],
    bgcol: 'yellow'
  })
};
</script>

<template>
  <AppLayout>
    <div>TreePage</div>
    <hr>
    <h2>render</h2>
    <ul v-model="treeModel" is="PadoNode" ref="rootnode" class="foobar">
      <template slot-scope="node">
        <template v-for="item in node.model">
          <li :key="item.name+0">
            {{ item.name }}
          </li>
          <li v-if="item.children && item.children.length" :key="item.name+1">
            ({{ item.name }} hasChild)
            <ul v-model="item.children" is="PadoNode">
              <template slot-scope="node">
                <li v-for="(item, index) in node.model" :key="item.name">
                  {{index}}-{{ item }}
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
          {name: "chi"}
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

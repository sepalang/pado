<template>
  <AppLayout>
    <div>TreePage</div>
    <hr>
    <h2>render</h2>
    <ul v-model="treeModel" is="PadoNode" ref="rootnode" class="foo" :class={bar:true}>
      <template slot-scope="{ contexts }">
        <template v-for="scope in contexts">
          <li :key="scope.datum.name+0">
            <button @click="scope.open()" :disabled="!scope.hasChildren">{{scope.depth}} OPEN</button>
            {{ scope.datum.name }}
          </li>
          <li v-if="scope.visibleChildren" :key="scope.datum.name+1" style="display:block;">
            <ul v-model="scope.children" is="PadoNode">
              <template slot-scope="{ contexts }">
                <li v-for="(scope, index) in contexts" :key="scope.datum.name" style="display:block;">
                  <input type="checkbox" v-model="scope.datum.$selected">
                  <button @click="scope.selected()"></button>
                  [{{scope.depth + ':' + index}}] {{ scope.datum.name }}
                  <button @click="scope.open()" :disabled="!scope.hasChildren">MORE</button>
                  <div v-if="scope.visibleChildren" is="PadoNode" v-model="scope.children">
                    <template slot-scope="{ contexts }">
                      <div v-for="(scope ,index) in contexts" :key="scope.datum.name">
                        [{{ scope.depth + ':' + index }}] {{ scope.datum.name }}
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

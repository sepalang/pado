<template>
  <AppLayout>
    <div>TreePage</div>
    <hr>
    <h2>render</h2>
    <ul is="Nodelist" v-model="treeModel" ref="rootnode" class="foo" :class="{bar:true}">
      <template slot-scope="{ contexts }">
        <template v-for="scope in contexts">
          <li :key="scope.datum.name+0">
            <button @click="scope.open()" :disabled="!scope.hasChildren">{{scope.depth}} OPEN</button>
            {{ scope.datum.name }} {{ scope.key }}
          </li>
          <li v-if="scope.visibleChildren" :key="scope.datum.name+1" style="display:block;">
            <ul is="Nodelist" v-model="scope.children" >
              <template slot-scope="{ contexts }">
                <li v-for="(scope, index) in contexts" :key="scope.datum.name" style="display:block;">
                  <input type="checkbox" v-model="scope.datum.$selected">
                  <button @click="scope.selected()"></button>
                  [{{scope.depth + ':' + index}}] {{ scope.datum.name }} {{ scope.key }}
                  <button @click="scope.open()" :disabled="!scope.hasChildren">MORE</button>
                  <div v-if="scope.visibleChildren" is="Nodelist" v-model="scope.children">
                    <template slot-scope="{ contexts }">
                      <div v-for="(scope ,index) in contexts" :key="scope.datum.name">
                        [{{ scope.depth + ':' + index }}] {{ scope.datum.name }} {{ scope.key }}
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
    <button @click="toggleTest">toggleTest</button>
    <div>{{toggleValue}}</div>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import Nodelist from '../components/Nodelist.vue';
import { toggle } from '@sepalang/pado/functions';

export default {
  components: {
    AppLayout,
    Nodelist
  },
  data: ()=>({
    treeModel: [
      {
        name     : 'foo',
        $children: [
          {
            name     : "kim",
            $children: [
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
    bgcol      : 'yellow',
    toggleValue: undefined
  }),
  methods: {
    toggleTest (){
      this.toggleValue = toggle([true, false, 1], this.toggleValue);
    }
  },
  mounted (){
    console.log("rootnode", this.$refs.rootnode);
  }
};
</script>

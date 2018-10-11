<template>
  <AppLayout>
    <div>ScreenPage</div>
    <table style="width:500px;">
      <tbody>
        <tr>
          <td>
            <PadoScreen padding="30" width="100" height="100" ref="screenReference">
              <div style="width:167px;height:167px;">
                <img src="@/assets/sepalang.png">
              </div>
            </PadoScreen>
          </td>
          <td>
            <PadoMinimap class="debug" :screenRef="$refs.screenReference" width="100" height="70">
              <div>
                Hi!
              </div>
            </PadoMinimap>
          </td>
          <td>
            <PadoMinimap class="debug" :screenRef="$refs.screenReference" width="100" height="70">
              <template slot-scope="{ ratio }">
                <div :style="{transform:`scale(${ratio})`}">
                  <img src="@/assets/sepalang.png">
                </div>
              </template>
            </PadoMinimap>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            Viewport : {{ screenViewport }}
          </td>
        </tr>
      </tbody>
    </table>
  </AppLayout>
</template>
<script>
import AppLayout from '../layouts/AppLayout.vue';
import PadoScreen from '@/components/PadoScreen.vue';
import PadoMinimap from '@/components/PadoMinimap.vue';

export default {
  components: {
    AppLayout,
    PadoScreen,
    PadoMinimap
  },
  data (){
    return {
      screenViewport: undefined
    };
  },
  mounted (){
    this.$watch(()=>this.$refs.screenReference.viewport, (viewport)=>{
      this.screenViewport = viewport;
    });
  }
};
</script>

<template>
  <AppLayout>
    <div>ScreenPage</div>
    <table style="width:400px;">
      <tbody>
        <tr>
          <td>
            <PadoScreen padding="20" width="150" height="100" :viewport="screenViewport">
              <img src="@/assets/sepalang.png">
            </PadoScreen>
          </td>
          <td>
            <PadoMinimap padding="20" width="100" height="70" :viewport="screenViewport">
              <img src="@/assets/sepalang.png" style="width:167px;height:167px;">
            </PadoMinimap>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            {{ screenViewport }}
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
      screenViewport: {}
    };
  }
};
</script>

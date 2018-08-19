import Vue from 'vue';
import Router from 'vue-router';
import TransformPage from '@/pages/TransformPage.vue';
import MainPage from '@/pages/MainPage.vue';
import TreePage from '@/pages/TreePage.vue';
import ModalPage from '@/pages/ModalPage.vue';
import GridMapPage from '@/pages/GridMapPage.vue';
import SliderPage from '@/pages/SliderPage.vue';
import ScreenPage from '@/pages/ScreenPage.vue';
import ControlsPage from '@/pages/ControlsPage.vue';
import LinePage from '@/pages/LinePage.vue';
import WowPage from '@/pages/WowPage.vue';
import TabPage from '@/pages/TabPage.vue';
import SpaceBlockPage from '@/pages/SpaceBlockPage.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path     : '/main',
      component: MainPage
    },
    {
      path     : '/controls',
      component: ControlsPage
    },
    {
      path     : '/tree',
      component: TreePage
    },
    {
      path     : '/modal',
      component: ModalPage
    },
    {
      path     : '/slider',
      component: SliderPage
    },
    {
      path     : '/screen',
      component: ScreenPage
    },
    {
      path     : '/grid-map',
      component: GridMapPage
    },
    {
      path     : '/transform',
      component: TransformPage
    },
    {
      path     : '/line',
      component: LinePage
    },
    {
      path     : '/space-block',
      component: SpaceBlockPage
    },
    {
      path     : '/wow',
      component: WowPage
    },
    {
      path     : '/tab',
      component: TabPage
    },
    {
      path    : '*',
      redirect: '/main'
    }
  ]
});

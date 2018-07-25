import Vue from 'vue';
import Router from 'vue-router';
import PostSVG from '@/pages/PostSVG.vue';
import PostTransform from '@/pages/PostTransform.vue';
import GridPage from '@/pages/GridPage.vue';
import MainPage from '@/pages/MainPage.vue';
import PanelPage from '@/pages/PanelPage.vue';
import TabPage from '@/pages/TabPage.vue';
import TreePage from '@/pages/TreePage.vue';
import ModalPage from '@/pages/ModalPage.vue';
import GridMapPage from '@/pages/GridMapPage.vue';
import RotateMapPage from '@/pages/RotateMapPage.vue';
import SliderPage from '@/pages/SliderPage.vue';
import ScreenPage from '@/pages/ScreenPage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path     : '/main',
      component: MainPage
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
      path     : '/rotate-map',
      component: RotateMapPage
    },
    {
      path     : '/grid-map',
      component: GridMapPage
    },
    {
      path     : '/grid',
      component: GridPage
    },
    {
      path     : '/transform',
      component: PostTransform
    },
    {
      path     : '/svg',
      component: PostSVG
    },
    {
      path     : '/panel',
      component: PanelPage
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

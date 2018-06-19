import Router from 'vue-router';
import Vue from './service/vue-factory';
import PostSVG from './pages/PostSVG.vue';
import PostTransform from './pages/PostTransform.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/transform',
      component: PostTransform
    },
    {
      path: '/svg',
      component: PostSVG
    },
    {
      path: '*',
      redirect: '/transform'
    }
  ]
})

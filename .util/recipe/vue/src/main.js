import Vue from 'vue';
import App from './App.vue';
import router from './service/router';
import store from './service/store';

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['stage', 'controls'];

new Vue({
  router,
  store,
  render:h=>h(App)
}).$mount('#app');

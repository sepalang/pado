import Vue from './service/vue-factory';
import router from './router';
import App from './App.vue';

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});

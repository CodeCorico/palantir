import Vue from 'vue';
import VueRouter from 'vue-router';
import Page from '@/layouts/views/Page.vue';
import routes from './routes.js';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
});

new Vue({
  router,
  render: h => h(Page),
}).$mount('#page');

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueShortkey from 'vue-shortkey';
import Page from '@/layouts/views/Page.vue';
import routes from './routes';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueShortkey);

const router = new VueRouter({ mode: 'history', routes });

new Vue({
  router,
  render: (h) => h(Page),
}).$mount('#page');

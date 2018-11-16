import Vue from 'vue'
import Page from '@/layouts/views/Page.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Page),
}).$mount('#page')

import { configure } from '@storybook/vue';

import Vue from 'vue';
import Header from '../../ui/views/Header.vue';
import Sidebar from '../../ui/views/Sidebar.vue';

Vue.component('ui-header', Header);
Vue.component('ui-sidebar', Sidebar);

function loadStories() {
  require('../../ui/views/stories/');
}

configure(loadStories, module);
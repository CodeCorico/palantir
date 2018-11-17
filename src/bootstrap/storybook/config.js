import { configure } from '@storybook/vue';

import Vue from 'vue';
import Header from '../../ui/views/Header.vue';
//import Sidebar from '../../ui/views/Sidebar.vue';

Vue.component('ui-header', Header);

function loadStories() {
  require('../../ui/views/stories/Header.stories');
}

configure(loadStories, module);
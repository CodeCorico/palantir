/* eslint-disable no-param-reassign, import/no-extraneous-dependencies */
import Vue from 'vue';
import Vuex from 'vuex';
// eslint-disable-next-line import/no-unresolved, import/extensions
import * as stores from '../*/stores/*.js';

Vue.use(Vuex);

const modules = {};
Object.keys(stores).forEach((key) => {
  modules[stores[key].name] = stores[key].store;
});

const store = new Vuex.Store({ modules });

export default store;

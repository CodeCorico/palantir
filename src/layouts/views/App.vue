<template>
  <component :is="comp" :config="config"></component>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import AppGithubPulls from '@/app-github-pulls/views/AppGithubPulls';

export default {
  name: 'temp',
  store,
  components: {
    AppGithubPulls,
  },
  computed: {
    ...mapState('Config', ['apps', 'appRoot']),
    comp() {
      const app = this.app();

      return `app-${app.type}`;
    },
    config() {
      const app = this.app();

      return app.config || {};
    }
  },
  methods: {
    load() {
      this.$store.dispatch('Config/load');
    },
    app() {
      const appId = this.$route.params.appId || this.appRoot;

      if (!this.apps[appId]) {
        throw new Error(`No app with the id "${appId}"`);
      }

      return this.apps[appId];
    }
  },
};
</script>

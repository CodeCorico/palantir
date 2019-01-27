<template>
  <div class="app-grid">
    <div
      class="grid-app"
      v-for="app in apps"
      :key="app.app"
      :style="`top: ${app.y}; left: ${app.x}; width: ${app.width}; height: ${app.height};`"
    >
      <component
        :is="`app-${app.def.type}`"
        :config="app.def.config || {}"
        :app-route="app.def.url"
        :app-local-route="$route.params.appLocalRoute"
      ></component>
    </div>
  </div>
</template>

<script>
import store from '@/services/store';
import AppGithubPulls from '@/app-github-pulls/views/AppGithubPulls';
import AppTimeline from '@/app-timeline/views/AppTimeline';
import AppFrame from '@/app-frame/views/AppFrame.vue';
import AppPages from '@/app-pages/views/AppPages.vue';
import AppGoogleCalendar from '@/app-google-calendar/views/AppGoogleCalendar.vue';

export default {
  name: 'app-grid',
  store,
  components: {
    AppGithubPulls,
    AppTimeline,
    AppFrame,
    AppPages,
    AppGoogleCalendar,
  },
  props: {
    config: Object,
  },
  mounted() {
    this.$store.dispatch('Apps/switchTasks', {
      appsIds: this.config.apps.map(app => app.app),
      enable: true,
    });
  },
  destroyed() {
    this.$store.dispatch('Apps/switchTasks', {
      appsIds: this.config.apps.map(app => app.app),
      enable: false,
    });
  },
  computed: {
    mainConfig() {
      return this.$store.state.Config.config;
    },
    apps() {
      return this.config.apps.map(app => Object.assign({
        def: this.mainConfig.apps[app.app]
      }, app));
    },
  },
};
</script>

<style lang="scss" scoped>
.app-grid {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .grid-app {
    position: absolute;
  }
}
</style>

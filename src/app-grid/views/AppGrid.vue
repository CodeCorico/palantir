<template>
  <div class="app-grid">
    <div
      class="grid-app"
      v-for="app in apps"
      :key="app.app"
      :style="`
        top: ${typeof app.top === 'undefined' ? 'auto' : app.top};
        left: ${typeof app.left === 'undefined' ? 'auto' : app.left};
        right: ${typeof app.right === 'undefined' ? 'auto' : app.right};
        bottom: ${typeof app.bottom === 'undefined' ? 'auto' : app.bottom};
        width: ${typeof app.width === 'undefined' ? 'auto' : app.width};
        height: ${typeof app.height === 'undefined' ? 'auto' : app.height};
      `"
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

export default {
  name: 'app-grid',
  store,
  components: {
    AppGithubPulls: () => import('@/app-github-pulls/views/AppGithubPulls'),
    AppBitbucketPulls: () => import('@/app-bitbucket-pulls/views/AppBitbucketPulls'),
    AppTimeline: () => import('@/app-timeline/views/AppTimeline'),
    AppFrame: () => import('@/app-frame/views/AppFrame.vue'),
    AppPages: () => import('@/app-pages/views/AppPages.vue'),
    AppGoogleCalendar: () => import('@/app-google-calendar/views/AppGoogleCalendar.vue'),
    AppOutlookCalendar: () => import('@/app-outlook-calendar/views/AppOutlookCalendar.vue'),
    AppTrello: () => import('@/app-trello/views/AppTrello.vue'),
    AppFreshteam: () => import('@/app-freshteam/views/AppFreshteam.vue'),
    AppJiraCapacity: () => import('@/app-jira-capacity/views/AppJiraCapacity.vue'),
    AppJiraRoadmap: () => import('@/app-jira-roadmap/views/AppJiraRoadmap.vue'),
    AppJiraRun: () => import('@/app-jira-run/views/AppJiraRun.vue'),
  },
  props: {
    config: Object,
  },
  mounted() {
    this.$store.dispatch('Apps/switchTasks', {
      appsIds: this.config.apps.map((app) => app.app),
      enable: true,
    });
  },
  destroyed() {
    this.$store.dispatch('Apps/switchTasks', {
      appsIds: this.config.apps.map((app) => app.app),
      enable: false,
    });
  },
  computed: {
    mainConfig() {
      return this.$store.state.Config.config;
    },
    apps() {
      return this.config.apps.map((app) => ({ def: this.mainConfig.apps[app.app], ...app }));
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

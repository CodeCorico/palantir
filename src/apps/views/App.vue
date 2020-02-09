<template>
  <component
    v-if="activeApp"
    :is="`app-${activeApp.type}`"
    :config="activeApp.config || {}"
    :app-route="activeApp.url"
    :app-local-route="$route.params.appLocalRoute"
  ></component>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'app',
  store,
  components: {
    AppError: () => import('@/app-error/views/AppError'),
    AppGithubPulls: () =>import('@/app-github-pulls/views/AppGithubPulls'),
    AppBitbucketPulls: () =>import('@/app-bitbucket-pulls/views/AppBitbucketPulls'),
    AppTimeline: () =>import('@/app-timeline/views/AppTimeline'),
    AppFrame: () =>import('@/app-frame/views/AppFrame.vue'),
    AppPages: () =>import('@/app-pages/views/AppPages.vue'),
    AppGoogleCalendar: () =>import('@/app-google-calendar/views/AppGoogleCalendar.vue'),
    AppOutlookCalendar: () =>import('@/app-outlook-calendar/views/AppOutlookCalendar.vue'),
    AppTrello: () =>import('@/app-trello/views/AppTrello.vue'),
    AppFreshteam: () =>import('@/app-freshteam/views/AppFreshteam.vue'),
    AppGrid: () =>import('@/app-grid/views/AppGrid.vue'),
    AppJiraCapacity: () =>import('@/app-jira-capacity/views/AppJiraCapacity.vue'),
    AppJiraRoadmap: () => import('@/app-jira-roadmap/views/AppJiraRoadmap.vue'),
    AppJiraRun: () =>import('@/app-jira-run/views/AppJiraRun.vue'),
  },
  mounted() {
    this.routeUpdated();
  },
  computed: {
    ...mapState('Apps', ['apps', 'appRoot', 'activeApp']),
  },
  watch:{
    $route() {
      this.routeUpdated();
    },
  },
  methods: {
    routeUpdated() {
      this.$store.dispatch('Apps/activeApp', this.$route.params.appId);
    },
  },
};
</script>

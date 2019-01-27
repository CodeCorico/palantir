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
import AppError from '@/app-error/views/AppError';
import AppGithubPulls from '@/app-github-pulls/views/AppGithubPulls';
import AppTimeline from '@/app-timeline/views/AppTimeline';
import AppFrame from '@/app-frame/views/AppFrame.vue';
import AppPages from '@/app-pages/views/AppPages.vue';
import AppGoogleCalendar from '@/app-google-calendar/views/AppGoogleCalendar.vue';
import AppGrid from '@/app-grid/views/AppGrid.vue';

export default {
  name: 'app',
  store,
  components: {
    AppError,
    AppGithubPulls,
    AppTimeline,
    AppFrame,
    AppPages,
    AppGoogleCalendar,
    AppGrid,
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

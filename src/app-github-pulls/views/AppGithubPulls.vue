<template>
  <ui-pulls :config="config" :groups="groups" :changes="changes" />
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiPulls from '@/ui/views/Pulls.vue';

export default {
  name: 'app-github-pulls',
  store,
  components: { UiPulls },
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('GithubPulls/clear');
  },
  computed: {
    ...mapState('GithubPulls', ['changes', 'groups']),
  },
};
</script>

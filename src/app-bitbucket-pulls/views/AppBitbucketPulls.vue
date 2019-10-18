<template>
  <ui-pulls :config="config" :groups="groups" :changes="changes" />
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiPulls from '@/ui/views/Pulls.vue';

export default {
  name: 'app-bitbucket-pulls',
  store,
  components: { UiPulls },
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('BitbucketPulls/clear');
  },
  computed: {
    ...mapState('BitbucketPulls', ['changes', 'groups']),
  },
};
</script>

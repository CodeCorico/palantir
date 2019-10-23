<template>
  <ui-calendar
    :config="config" :signed="signed" :events="events"
    @signin="signin"
    @signout="signout"
  />
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiCalendar from '@/ui/views/Calendar.vue';

export default {
  name: 'app-google-calendar',
  store,
  components: { UiCalendar },
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('GoogleCalendar/clear');
  },
  computed: {
    ...mapState('GoogleCalendar', ['signed', 'events']),
  },
  methods: {
    signin() {
      this.$store.dispatch('GoogleCalendar/signin');
    },
    signout() {
      this.$store.dispatch('GoogleCalendar/signout');
    },
  },
};
</script>

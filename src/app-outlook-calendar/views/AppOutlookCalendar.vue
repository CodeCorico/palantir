<template>
  <div class="app-outlook-calendar">
    <div class="iframes">
      <iframe ref="frame" class="iframe" allow="autoplay" src="https://outlook.office365.com/calendar/view/day" />
    </div>
    <ui-calendar :config="config" :signed="true" :events="events" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiCalendar from '@/ui/views/Calendar.vue';

export default {
  name: 'app-outlook-calendar',
  store,
  components: { UiCalendar },
  props: {
    config: Object,
  },
  mounted() {
    window.addEventListener('message', this.onMessage, false);
  },
  destroyed() {
    window.removeEventListener('message', this.onMessage, false);

    this.$store.dispatch('OutlookCalendar/clear');
  },
  watch: {
    consume() {
      if (this.consume) {
        this.message('action', { action: 'consume' });
      }
    },
  },
  computed: {
    ...mapState('OutlookCalendar', ['events', 'consume']),
  },
  methods: {
    message(name, data) {
      this.$refs.frame.contentWindow
        .postMessage({ name, ...data || {} }, 'https://outlook.office365.com');
    },
    onMessage(event) {
      if (!event.data.name || event.origin.indexOf('https://outlook.office365.com') < 0) {
        return;
      }

      if (event.data.name === 'ready') {
        this.$store.dispatch('OutlookCalendar/frameReady');
      } else if (event.data.name === 'events') {
        this.$store.dispatch('OutlookCalendar/collectEvents', event.data.events);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-outlook-calendar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .iframes {
    position: fixed;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;

    .iframe {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      border: 0;
    }
  }
}
</style>

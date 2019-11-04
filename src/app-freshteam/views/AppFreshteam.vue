<template>
  <div class="app-freshteam">
    <div class="iframes">
      <iframe ref="frame" class="iframe" allow="autoplay" :src="`https://${config.domain}/dashboard/me`" />
    </div>

    <div class="container">
      <div v-if="requests.today.remote.length || requests.today.off.length">
        <h2>Today</h2>

        <div v-if="requests.today.remote.length">
          <h3>Remote</h3>

          <div>
            <ui-user-target v-for="request in requests.today.remote" :key="request.id"
              :title="request.user.name" :avatar="request.avatar" :target="request.target"
              :type="request.userType"
            />
          </div>
        </div>
        <div v-if="requests.today.off.length">
          <h3>Off</h3>

          <div>
            <ui-user-target v-for="request in requests.today.off" :key="request.id"
              :title="request.user.name" :avatar="request.avatar" :target="request.target"
              :type="request.userType"
            />
          </div>
        </div>
      </div>
      <div v-if="requests.nextDays.remote.length || requests.nextDays.off.length">
        <h2>Next days</h2>

        <div v-if="requests.nextDays.remote.length">
          <h3>Remote</h3>

          <div>
            <ui-user-target v-for="request in requests.nextDays.remote" :key="request.id"
              :title="request.user.name" :avatar="request.avatar" :target="request.target"
              :type="request.userType"
            />
          </div>
        </div>
        <div v-if="requests.nextDays.off.length">
          <h3>Off</h3>

          <div>
            <ui-user-target v-for="request in requests.nextDays.off" :key="request.id"
              :title="request.user.name" :avatar="request.avatar" :target="request.target"
              :type="request.userType"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiUserTarget from '@/ui/views/UserTarget.vue';
import moment from 'moment';

moment.locale('fr');

export default {
  name: 'app-freshteam',
  store,
  components: { UiUserTarget },
  props: {
    config: Object,
  },
  mounted() {
    window.addEventListener('message', this.onMessage, false);
  },
  destroyed() {
    window.removeEventListener('message', this.onMessage, false);

    this.$store.dispatch('Freshteam/clear');
  },
  watch: {
    consume() {
      if (this.consume) {
        this.message('action', {
          action: 'consume',
          domain: this.config.domain,
          groupId: this.config['group-id'],
        });
      }
    },
  },
  computed: {
    ...mapState('Freshteam', ['requests', 'consume']),
    requests() {
      const avatars = this.config.avatars || {};
      const remoteTypes = this.config['remote-types'] || [];
      const { requests } = this.$store.state.Freshteam;
      const result = {
        today: { remote: [], off: [] },
        nextDays: { remote: [], off: [] },
      };
      const month = new Date().getMonth();

      ['today', 'nextDays'].forEach((branch) => {
        if (!requests[branch]) {
          return;
        }

        requests[branch].forEach((originRequest) => {
          const isRemote = remoteTypes.indexOf(originRequest.type) > -1;

          const request = Object.assign({
            avatar: avatars[originRequest.user.name] || null,
            target: null,
            userType: isRemote ? 'success' : 'error',
          }, originRequest);

          const startDate = new Date(originRequest.startDate);
          const endDate = new Date(originRequest.endDate);
          const addStartMonth = startDate.getMonth() !== month ? 'MMMM' : '';
          const addEndMonth = endDate.getMonth() !== month ? 'MMMM' : '';

          if (branch === 'today' && originRequest.startDate !== originRequest.endDate) {
            request.target = `→ ${moment(endDate).format(`dddd Do ${addEndMonth}`)}`;
          }
          if (branch === 'nextDays') {
            request.target = [
              moment(new Date(originRequest.startDate)).format(`dddd Do ${addStartMonth}`),
              originRequest.startDate !== originRequest.endDate
                ? ` → ${moment(endDate).format(`dddd Do ${addEndMonth}`)}`
                : (request.units !== 1
                ? ` [${request.units}]`
                : '')
            ].join('');
          }

          result[branch][isRemote ? 'remote' : 'off'].push(request);
        });
      });

      return result;
    },
  },
  methods: {
    message(name, data) {
      this.$refs.frame.contentWindow
        .postMessage(Object.assign({ name }, data || {}), `https://${this.config.domain}`);
    },
    onMessage(event) {
      if (!event.data.name || event.origin.indexOf(`https://${this.config.domain}`) < 0) {
        return;
      }

      if (event.data.name === 'ready') {
        this.$store.dispatch('Freshteam/frameReady');
      }
      else if (event.data.name === 'requests') {
        this.$store.dispatch('Freshteam/collectRequests', event.data.requests);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-freshteam {
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

  h2, h3 {
    padding: 0;
  }

  h2 {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }

  h3 {
    margin: 5px 0;
    font-size: 12px;
    opacity: 0.7;
  }

  .container {
    padding: 40px;
  }
}
</style>

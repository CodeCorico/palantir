<template>
  <div class="app-jira-capacity">
    <capacity-chart class="chart" :labels="epics.labels" :values="epics.values" />

    <div class="details">
      <div
        class="detail"
        v-for="epicDetail in epicsDetails"
        :key="epicDetail.id"
        :style="`height: ${100 / epicsDetails.length}%`"
      >
        <!-- There is not possible to have the velocity anymore -->
        <span class="estimation" v-if="false && epicDetail.todo">
          <span>•</span> {{ planningTime(epicDetail) }} weeks
        </span>
        <span
          class="unestimated"
          v-if="epicDetail.unestimatedPercent"
        >{{ epicDetail.unestimatedPercent }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import CapacityChart from './CapacityChart.vue';

export default {
  name: 'app-jira-capacity',
  store,
  components: { CapacityChart },
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('JiraCapacity/clear');
  },
  computed: {
    ...mapState('JiraCapacity', ['epics', 'epicsDetails']),
  },
  methods: {
    planningTime(epicDetail) {
      return Math.round((epicDetail.todo / 1) /* this.velocity.weekly */ * 10) / 10;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

@keyframes unestimated-alert {
  from { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.2); }
  to { transform: translateY(-50%) scale(1); }
}

.app-jira-capacity {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  background: #333248;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    bottom: 0;
    background: #292a3e;
  }

  .chart {
    position: absolute;
    top: -10px;
    left: 0;
    right: 220px;
    bottom: -10px;
  }

  .details {
    position: absolute;
    top: 0;
    right: 0;
    width: 220px;
    bottom: 0;
    background: #292a3e;

    .detail {
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      color: #ffffffdd;

      .estimation {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);

        span {
          position: relative;
          top: 7px;
          vertical-align: top;
          font-size: 30px;
          line-height: 1px;
          color: #f2c562;
        }
      }

      .unestimated {
        box-sizing: border-box;
        display: block;
        position: absolute;
        top: 50%;
        right: 20px;
        height: 28px;
        transform: translateY(-50%);
        background: #e57a50;
        color: #fff;
        padding: 5px 0;
        animation: unestimated-alert 1.5s linear infinite;

        &::before, &::after {
          content: '';
          z-index: -1;
          display: block;
          position: absolute;
          top: 4px;
          width: 20px;
          height: 20px;
          transform: rotate(-45deg);
          background: #e57a50;
        }

        &::before {
          left: -10px;
        }

        &::after {
          right: -10px;
        }
      }
    }
  }
}
</style>

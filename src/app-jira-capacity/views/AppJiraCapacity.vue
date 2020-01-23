<template>
  <div class="app-jira-capacity">
    <div class="banner">
      <div class="velocity">
        <div class="count">{{ velocity.sprint }}</div>
        <div class="title">VELOCITY</div>
      </div>
      <div class="sprints">
        <sprints-chart class="chart" :labels="sprints.labels" :values="sprints.values" />
      </div>
      <div class="active-sprint">
        <active-sprint-chart class="chart" :values="activeSprint.values" />
        <div class="title">{{ activeSprint.name }}</div>
      </div>
    </div>
    <div class="planning">
      <capacity-chart class="chart" :labels="epics.labels" :values="epics.values" />

      <div class="details">
        <div
          class="detail"
          v-for="epicDetail in epicsDetails"
          :key="epicDetail.id"
          :style="`height: ${100 / epicsDetails.length}%`"
        >
          <span class="estimation" v-if="epicDetail.todo">
            <span>•</span> {{ planningTime(epicDetail) }} weeks</span>
          <span
            class="unestimated"
            v-if="epicDetail.unestimatedPercent"
          >{{ epicDetail.unestimatedPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import SprintsChart from './SprintsChart.vue';
import ActiveSprintChart from './ActiveSprintChart.vue';
import CapacityChart from './CapacityChart.vue';

export default {
  name: 'app-jira-capacity',
  store,
  components: { SprintsChart, ActiveSprintChart, CapacityChart },
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('JiraCapacity/clear');
  },
  computed: {
    ...mapState('JiraCapacity', ['velocity', 'sprints', 'activeSprint', 'epics', 'epicsDetails']),
  },
  methods: {
    planningTime(epicDetail) {
      return Math.round(epicDetail.todo / this.velocity.weekly * 10) / 10;
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

  .banner {
    position: relative;
    display: flex;
    flex: nowrap;
    height: 200px;
    background: linear-gradient(45deg, #ead67e 0%,#f2c562 100%);
    color: #997f36;

    &::after {
      content: '';
      opacity: 0.1;
      position: absolute;
      top: 0;
      left: 0;
      right: 220px;
      bottom: 0;
      background: url(../assets/bg.png) no-repeat;
      background-size: cover;
      background-position: center -150px;
    }

    .velocity {
      position: relative;
      min-width: 200px;
      max-width: 200px;
      width: 200px;
      background: linear-gradient(45deg, #db4622 0%, #f09367 100%);
      color: #fff;

      .count {
        position: absolute;
        top: 40px;
        left: 80px;
        font-size: 60px;
      }

      .title {
        position: absolute;
        top: 110px;
        right: 0;
        padding: 10px 20px 0 0;
        font-size: 20px;
        border-top: 1px solid #fff;
      }
    }

    .sprints {
      position: relative;
      flex: 1;

      .chart {
        position: relative;
        height: 200px;
      }
    }

    .active-sprint {
      position: relative;
      min-width: 220px;
      max-width: 220px;
      width: 220px;
      background: #23263a;
      color: #fff;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-shadow: inset 0 0 30px 0 rgba(0, 0, 0, 0.1);
      }

      .chart {
        position: absolute;
        top: 55px;
        left: (220px - 140px) / 2;
        width: 140px;
        height: 140px;
      }

      .title {
        position: absolute;
        bottom: 5px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 20px;
        text-shadow: 0px 2px 3px #000;
      }
    }
  }

  .planning {
    position: absolute;
    top: 200px;
    left: 0;
    right: 0;
    bottom: 0;
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
}
</style>

<template>
  <div class="app-jira-run">
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
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import SprintsChart from './SprintsChart.vue';
import ActiveSprintChart from './ActiveSprintChart.vue';

export default {
  name: 'app-jira-capacity',
  store,
  components: { SprintsChart, ActiveSprintChart },
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('JiraRun/clear');
  },
  computed: {
    ...mapState('JiraRun', ['velocity', 'sprints', 'activeSprint']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.app-jira-run {
  position: relative;
  display: flex;
  flex: nowrap;
  height: 100%;
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
</style>

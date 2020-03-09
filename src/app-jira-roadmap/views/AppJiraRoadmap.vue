<template>
  <div class="app-jira-roadmap">
    <div class="events" :style="`height: ${20 + (maxEvents * 30)}px`">
      <div
        v-for="sprint in events"
        :key="sprint.name"
        class="event-sprint"
        :style="`width: ${100 / events.length}%`"
      >
        <div
          v-for="(event, eventIndex) in sprint.events"
          :key="event.date"
          class="event"
          :style="`
            left: ${event.percent}%;
            height: ${15 + ((sprint.events.length - (eventIndex + 1)) * 30)}px;
          `"
        >
          <div class="event-title">
            <strong>{{ event.date }}</strong> {{ event.title }}
          </div>
        </div>
      </div>
    </div>

    <div class="sprints" v-if="sprints.length">
      <div class="sprint backlog">Backlog</div>

      <div
        v-for="sprint in sprints"
        :key="sprint.title"
        class="sprint"
        :style="`width: ${100 / sprints.length}%`"
      >
        <div class="title">{{ sprint.title }}</div>
        <div class="date-start" v-if="sprint.date[0]">{{ sprint.date[0] }}</div>
        <div class="date-end" v-if="sprint.date[1]">{{ sprint.date[1] }}</div>
      </div>

      <div class="sprint done">Awesome</div>
    </div>

    <div class="epics">
      <div v-for="epic in epics" :key="epic.id" class="epic">
        <div class="title">{{ epic.name }}</div>

        <div class="epic-backlog">
          <span class="todo">
            {{ epic.estimate.backlog }}pt ({{ epic.estimate.backlogPercent }}%)
          </span>
          <span class="unestimated" v-if="epic.estimate.unestimatedPercent">
            {{ epic.estimate.unestimatedPercent }}%
          </span>
        </div>

        <div class="epic-sprints">
          <div
            v-for="sprint in epic.sprints"
            :key="sprint.title"
            class="sprint"
            :style="`width: ${100 / sprints.length}%`"
          >
            <div
              v-if="sprint && typeof sprint.startAt !== 'undefined'"
              class="sprint-progress"
              :style="`left: ${sprint.startAt}%; width: ${sprint.percent}%`"
            >
              {{ sprint.value }}pt ({{ sprint.percent }}%)
            </div>
          </div>
        </div>

        <div class="epic-done">
          <span>{{ epic.estimate.done }}pt ({{ epic.estimate.donePercent }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'app-jira-roadmap',
  store,
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('JiraRoadmap/clear');
  },
  computed: {
    ...mapState('JiraRoadmap', ['events', 'maxEvents', 'sprints', 'epics']),
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

$epicsWidth: 200px;
$backlogWidth: 160px;
$doneWidth: 100px;

.app-jira-roadmap {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  background: #333248;
  font-size: 12px;
  line-height: 1.3;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: $epicsWidth;
    bottom: 0;
    background: #292a3e;
  }

  .events {
    position: relative;
    display: flex;
    min-height: 65px;
    margin-left: $epicsWidth + $backlogWidth;
    margin-right: $doneWidth;
    color: rgba(255, 255, 255, 0.8);

    .event-sprint {
      position: relative;
      box-sizing: border-box;
      display: inline-block;
      vertical-align: top;

      .event {
        position: absolute;
        bottom: 0;
        height: 15px;
        width: 0;
        border-left: 2px solid #07b3b994;

        .event-title {
          position: absolute;
          box-sizing: border-box;
          left: -2px;
          top: -25px;
          height: 25px;
          max-width: 220px;
          padding: 4px;
          border-radius: 5px;
          border-bottom-left-radius: 0;
          background: #07b3b994;
          line-height: 1.5;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;

          strong {
            font-weight: 600;
          }
        }
      }
    }
  }

  .sprints {
    position: relative;
    display: flex;
    margin-left: $epicsWidth;
    min-height: 35px;
    border-top: 2px solid #2c293c;
    color: rgba(255, 255, 255, 0.8);

    .sprint {
      position: relative;
      box-sizing: border-box;
      display: inline-block;
      vertical-align: top;
      padding: 10px 0;
      border-right: 2px solid #2c293c;
      text-align: center;

      &.backlog {
        width: $backlogWidth;
        min-width: $backlogWidth;
        max-width: $backlogWidth;
      }

      &.done {
        width: $doneWidth;
        min-width: $doneWidth;
        max-width: $doneWidth;
      }

      .date-start, .date-end {
        position: absolute;
        top: 2px;
        font-size: 10px;
        font-weight: 300;
        opacity: 0.5
      }

      .date-start {
        left: 2px;
      }

      .date-end {
        right: 2px;
      }
    }
  }

  .epics {
    .epic {
      position: relative;
      border-bottom: 2px solid #2c293c;
      min-height: 35px;
      overflow: hidden;

      &:first-child {
        border-top: 2px solid #2c293c;
      }

      .title {
        position: relative;
        box-sizing: border-box;
        display: inline-block;
        width: $epicsWidth;
        overflow: hidden;
        padding: 5px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .epic-backlog {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: $epicsWidth;
        width: $backlogWidth;
        bottom: 0;
        padding: 8px 0 0 10px;
        border-right: 2px solid #2c293c;

        span {
          padding: 4px 5px 4px 8px;
          border-radius: 10px;
          color: #fff;
          white-space: nowrap;
          margin-right: 5px;

          &.todo {
            background: #676767;
          }

          &.unestimated {
            background: #e57a50;
          }
        }
      }

      .epic-sprints {
        position: absolute;
        top: 0;
        left: ($epicsWidth + $backlogWidth);
        right: $doneWidth;
        bottom: 0;

        .sprint {
          position: relative;
          box-sizing: border-box;
          display: inline-block;
          min-height: 35px;
          vertical-align: top;
          border-right: 2px solid #2c293c;
          overflow: hidden;

          .sprint-progress {
            position: absolute;
            box-sizing: border-box;
            height: 22px;
            top: 7px;
            padding: 4px 8px;
            border-radius: 10px;
            background-color: #07b3b994;
            color: #fff;
            white-space: nowrap;
          }
        }
      }

      .epic-done {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        right: 0;
        width: $doneWidth;
        padding: 8px 0 0 10px;

        span {
          padding: 4px 5px 4px 8px;
          border-radius: 10px;
          color: #fff;
          white-space: nowrap;
          background: #07b94e;
        }
      }
    }
  }

}
</style>

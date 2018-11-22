<template>
  <section class="ui-task" :class="[`state-${state}`]">
    <span v-if="id" class="task-id" :class="{ fade: state === 'running' }">{{ id }}</span>
    <h1>{{ name }}</h1>
    <p>{{ desc }}</p>
    <i v-if="state === 'running'" class="fas fa-cog"></i>
  </section>
</template>

<script>
export default {
  name: 'ui-task',
  props: {
    id: String,
    remainingTime: Number,
    state: {
      type: String,
      default: 'idle',
      validator: value => ['idle', 'running', 'success', 'error'].indexOf(value) > -1,
    },
    name: String,
    description: String,
  },
  computed: {
    desc() {
      return this.description.replace(/%s/g, this.formatTime(this.remainingTimeActual));
    }
  },
  methods: {
    formatTime(time) {
      let hours = Math.floor(time / 3600);
      let minutes = Math.floor((time - (hours * 3600)) / 60);
      let seconds = time - (hours * 3600) - (minutes * 60);

      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      return `${hours}:${minutes}:${seconds}`;
    },
    remainingTimeClock() {
      clearTimeout(this.remainingTimeTimeout);

      this.remainingTimeTimeout = setTimeout(() => {
        const newTime = this.remainingTimeActual - 1;

        this.$set(this, 'remainingTimeActual', newTime);

        if (newTime > 0) {
          this.remainingTimeClock();
        }
      }, 1000);
    },
  },
  data() {
    if (this.remainingTime) {
      this.remainingTimeClock();
    }

    return {
      remainingTimeTimeout: null,
      remainingTimeActual: this.remainingTime ? parseInt(this.remainingTime, 10) : null,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

@keyframes task-running {
  0% { transform: translateY(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}

.ui-task {
  user-select: none;
  position: relative;
  padding: 20px 20px 23px;
  margin: 0 -10px;
  border-bottom: 3px solid;

  &.state-idle {
    border-color: rgba(12, 181, 249, 0.8);
    // background: rgba(12, 181, 249, 0.4);
  }

  &.state-running {
    border-color: rgba(249, 182, 95, 0.8);
    // background: rgba(249, 182, 95, 0.4);
  }

  &.state-success {
    border-color: rgba(88, 216, 163, 0.8);
    // background: rgba(88, 216, 163, 0.4);
  }

  &.state-error {
    border-color: rgba(244, 118, 123, 0.8);
    // background: rgba(244, 118, 123, 0.4);
  }

  h1 {
    margin: 0;
    font-weight: 400;
    font-size: 14px;
    padding-left: 54px;
  }

  p {
    margin: 5px 0 0;
    font-size: 13px;
    opacity: 0.7;
    padding-left: 54px;
  }

  .task-id {
    position: absolute;
    top: 15px;
    left: 20px;
    font-weight: 300;
    font-size: 30px;
    color: rgba(255, 255, 255, 0.7);

    &.fade {
      opacity: 0.1;
    }
  }

  .fa-cog {
    position: absolute;
    top: 50%;
    left: 22px;
    font-size: 29px;
    animation: task-running 2s infinite linear;
  }
}
</style>

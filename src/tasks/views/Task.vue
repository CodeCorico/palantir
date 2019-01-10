<template>
  <section
    class="task"
    :class="[`status-${status}`]"
    v-shortkey="shortcut"
    @click="start"
    @shortkey="start"
  >
    <span v-if="number" class="task-number" :class="{ fade: status === 'running' }">
      {{ number }}
    </span>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <div v-if="shortcut" class="shortcuts">
      <span v-for="key in shortcut" :key="key">{{ key }}</span>
    </div>
    <i v-if="status === 'running'" class="fas fa-cog"></i>
  </section>
</template>

<script>
export default {
  name: 'task',
  props: {
    id: String,
    number: String,
    status: {
      type: String,
      default: 'idle',
      validator: value => ['idle', 'disabled', 'running', 'success', 'error'].indexOf(value) > -1,
    },
    title: String,
    description: String,
    dispatch: String,
    shortcut: Array,
    config: Object,
  },
  methods: {
    start() {
      if (this.status === 'disabled' || this.status === 'running') {
        return;
      }

      this.$store.dispatch('Page/closeButton', {
        location: 'right',
        id: 'tasks-sidebar',
      });

      this.$store.dispatch(this.dispatch, {
        id: this.id,
        config: this.config,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

@keyframes task-running {
  0% { transform: translateY(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}

.task {
  user-select: none;
  cursor: pointer;
  position: relative;
  padding: 20px 20px 23px;
  margin: 0 -10px;
  border-bottom: 3px solid;

  &.status-disabled {
    cursor: not-allowed;
    color: rgba(146, 146, 146, 0.8);
    border-color: rgba(97, 97, 97, 0.8);

    .task-number {
      color: rgba(146, 146, 146, 0.8);
    }
  }

  &.status-idle {
    border-color: rgba(12, 181, 249, 0.8);
    // background: rgba(12, 181, 249, 0.4);
  }

  &.status-running {
    border-color: rgba(249, 182, 95, 0.8);
    // background: rgba(249, 182, 95, 0.4);
  }

  &.status-success {
    border-color: rgba(88, 216, 163, 0.8);
    // background: rgba(88, 216, 163, 0.4);
  }

  &.status-error {
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

  .shortcuts {
    padding: 25px 0 0;
    font-size: 13px;
    opacity: 0.7;
    padding-left: 54px;

    span {
      background: #fff;
      font-weight: 700;
      padding: 3px 7px;
      font-size: 13px;
      margin-right: 2px;
      border-radius: 4px;
      color: #3d3c40;
      border-bottom: 2px solid #9e9ea6;
      box-shadow: 0 1px 2px rgba(0,0,0,.5);
    }
  }

  .task-number {
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

<template>
  <sidebar
    ref="sidebar"
    :position="position"
    :opened="opened"
  >
    <task
      v-for="task in tasks"
      :key="task.id"
      :id="task.id"
      :app-id="task.appId"
      :number="task.number"
      :title="task.title"
      :description="task.description"
      :status="task.status"
      :dispatch="task.dispatch"
      :shortcut="task.shortcut"
      :config="task.config"
      :slack-command="task.slackCommand"
    ></task>
  </sidebar>
</template>

<script>
import store from '@/services/store';
import Sidebar from '@/layouts/views/Sidebar.vue';
import Task from './Task.vue';

export default {
  name: 'tasks-sidebar',
  store,
  components: {
    Sidebar,
    Task,
  },
  props: {
    position: {
      type: String,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tasks() {
      this.$nextTick(() => this.$refs.sidebar.refresh());

      return this.$store.state.Apps.tasks;
    },
  },
};
</script>

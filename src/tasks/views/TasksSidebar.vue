<template>
  <sidebar
    :position="position"
    :opened.sync="opened"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <task
      v-for="(task, taskIndex) in tasks"
      :key="taskIndex"
      :id="taskIndex + 1"
      :title="task.title"
      :description="task.description"
      :remaining-time="2000"
    ></task>
    <task
      :id="1"
      title="Repository health checker"
      description="Check for new content in %s"
      :remaining-time="2000"
    ></task>
    <task
      :id="2"
      title="Repository fetcher"
      description="Download the repository content"
    ></task>
    <task
      :id="3"
      title="Repository builder"
      state="running"
      description="Build the repository"
      ></task>
    <task
      :id="4"
      title="Success task"
      description="A task in success"
      state="success"
    ></task>
    <task
      :id="5"
      title="Error task"
      description="A task in error"
      state="error"
    ></task>
  </sidebar>
</template>

<script>
import { mapState } from 'vuex';
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
    ...mapState('Tasks', ['tasks']),
  },
};
</script>

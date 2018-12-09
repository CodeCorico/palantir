<template>
  <sidebar
    :position="position"
    :opened.sync="opened"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <task
      v-for="task in tasks"
      :key="task.id"
      :id="task.id"
      :title="task.title"
      :description="task.description"
      :remaining-time="2000"
      :status="task.status"
      :dispatch="task.dispatch"
      :config="task.config"
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
    ...mapState('Apps', ['tasks']),
  },
};
</script>

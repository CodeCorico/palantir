<template>
  <div id="page">
    <ui-header>
      <template slot="left">
        <button @click="sidebarLeftOpened = !sidebarLeftOpened">toggle</button>
      </template>

      <template slot="right">
        <button @click="sidebarRightOpened = !sidebarRightOpened">toggle</button>
      </template>
    </ui-header>

    <div class="page-content">

    </div>

    <ui-sidebar class="page-sidebar-left" :opened="sidebarLeftOpened">
      <h2>Hello 1</h2>

      <h2>Hello 2</h2>
    </ui-sidebar>

    <ui-sidebar class="page-sidebar-right" :opened="sidebarRightOpened">
      <ui-task
        name="Repository health checker"
        description="Check every 5min for new content"
        :remaining-time="2000"
      ></ui-task>
      <ui-task
        name="Repository fetcher"
        description="Download the repository content"
      ></ui-task>
      <ui-task
        name="Repository builder"
        state="running"
        description="Build the repository"
        ></ui-task>
      <ui-task
        name="Success task"
        description="A task in success"
        state="success"
      ></ui-task>
      <ui-task
        name="Error task"
        description="A task in error"
        state="error"
      ></ui-task>
    </ui-sidebar>
  </div>
</template>

<script>
import UiHeader from '@/ui/views/Header.vue';
import UiSidebar from '@/ui/views/Sidebar.vue';
import UiTask from '@/ui/views/Task.vue';

export default {
  name: 'app',
  components: {
    UiHeader,
    UiSidebar,
    UiTask,
  },
  data() {
    return {
      sidebarLeftOpened: false,
      sidebarRightOpened: false,
    };
  },
};
</script>

<style lang="scss">
@import '@/ui/assets/variables.scss';

html, body {
  height: 100%;
}

body {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  color: $colorText;
  background: $colorBg;
}
</style>

<style lang="scss" scoped>
#page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .ui-header {
    height: 70px;
  }

  .page-content {
    flex: 1;
  }

  .page-sidebar-left, .page-sidebar-right {
    position: fixed;
    top: 70px;
    bottom: 0;
  }

  .page-sidebar-left {
    left: 0;
  }

  .page-sidebar-right {
    right: 0;
  }
}
</style>

<template>
  <div id="page">
    <ui-header
      ref="header"
      @buttonOpen="sidebarOpen"
      @buttonClose="sidebarClose"
      @click="headerClick"
      :buttons="[{
        location: 'left',
        title: 'Menu',
        icon: 'fas fa-bars',
      }, {
        location: 'left',
        title: 'Tasks',
        icon: 'fas fa-cog',
      }, {
        location: 'right',
        title: 'Documents',
        icon: 'fas fa-th-large',
      }, {
        location: 'right',
        name: 'lock',
        title: 'Lock',
        icon: 'fas fa-lock',
      }, {
        location: 'right',
        name: 'expand',
        title: 'Expand',
        icon: 'fas fa-expand',
      }]"
    ></ui-header>

    <div class="page-content">
      <router-view></router-view>
    </div>

    <categories-sidebar
      position="left"
      :opened.sync="sidebarLeftOpened"
      @close="sidebarLeftOpened = false"
    ></categories-sidebar>

    <ui-sidebar
      position="left"
      :opened.sync="sidebarRightOpened"
      @close="sidebarRightOpened = false"
    >
      <ui-task
        id="01"
        name="Repository health checker"
        description="Check for new content in %s"
        :remaining-time="2000"
      ></ui-task>
      <ui-task
        id="02"
        name="Repository fetcher"
        description="Download the repository content"
      ></ui-task>
      <ui-task
        id="03"
        name="Repository builder"
        state="running"
        description="Build the repository"
        ></ui-task>
      <ui-task
        id="04"
        name="Success task"
        description="A task in success"
        state="success"
      ></ui-task>
      <ui-task
        id="05"
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
import CategoriesSidebar from '@/categories/views/CategoriesSidebar.vue';

export default {
  name: 'page',
  components: {
    UiHeader,
    UiSidebar,
    UiTask,
    CategoriesSidebar,
  },
  data() {
    return {
      sidebarLeftOpened: false,
      sidebarRightOpened: false,
      locked: false,
    };
  },
  methods: {
    headerClick() {
      this.unlock();
    },
    sidebarOpen(button) {
      if ((button.name || '') === 'lock') {
        this.closeSidebars();
        this.lock();

        return;
      }
      if ((button.name || '') === 'expand') {
        this.closeSidebars(button.name);

        return;
      }

      this.$set(this, `sidebar${button.location === 'left' ? 'Left' : 'Right'}Opened`, true);
    },
    sidebarClose(button) {
      this.$set(this, `sidebar${button.location === 'left' ? 'Left' : 'Right'}Opened`, false);
    },
    closeSidebars(buttonName) {
      this.$refs.header.closeAllButtons(buttonName);
      this.$set(this, 'sidebarLeftOpened', false);
      this.$set(this, 'sidebarRightOpened', false);
    },
    lock() {
      if (this.locked) {
        return;
      }

      this.$refs.header.hideButtons();
      this.$refs.header.bigger(true);
      this.$set(this, 'locked', true);
    },
    unlock() {
      if (!this.locked) {
        return;
      }

      this.$refs.header.showButtons();
      this.$refs.header.bigger(false);
      this.$set(this, 'locked', false);
    },
  },
};
</script>

<style lang="scss">
@import '@/ui/assets/variables.scss';

html, body {
  height: 100%;
}

body {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  color: $colorText;
}
</style>

<style lang="scss" scoped>
#page {
  height: 100%;
  overflow: hidden;

  .page-content {
    box-sizing: border-box;
    height: 100%;
    padding-top: 60px;
    overflow: hidden;
  }
}
</style>

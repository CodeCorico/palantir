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
        location: 'right',
        title: 'Tasks',
        icon: 'fas fa-cog',
      }, {
        name: 'lock',
        location: 'right',
        title: 'Lock',
        icon: 'fas fa-lock',
      }]"
    ></ui-header>

    <div class="page-content">
      <router-view></router-view>

      <app-images-randomizer></app-images-randomizer>
    </div>

    <menu-sidebar
      position="left"
      class="page-sidebar"
      :opened.sync="sidebarLeftOpened"
      @close="sidebarLeftOpened = false"
    ></menu-sidebar>

    <tasks-sidebar
      position="right"
      class="page-sidebar"
      :opened.sync="sidebarRightOpened"
      @close="sidebarRightOpened = false"
    ></tasks-sidebar>
  </div>
</template>

<script>
import store from '@/services/store';
import UiHeader from '@/ui/views/Header.vue';
import MenuSidebar from '@/menu/views/MenuSidebar.vue';
import TasksSidebar from '@/tasks/views/TasksSidebar.vue';
import AppImagesRandomizer from '@/app-images-randomizer/views/AppImagesRandomizer.vue';

export default {
  name: 'page',
  store,
  components: {
    UiHeader,
    MenuSidebar,
    TasksSidebar,
    AppImagesRandomizer,
  },
  mounted() {
    this.load();
  },
  data() {
    return {
      sidebarLeftOpened: false,
      sidebarRightOpened: false,
      locked: false,
    };
  },
  methods: {
    load() {
      this.$store.dispatch('Config/load');
    },
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
      if ((button.name || '') === 'test') {
        this.$refs.randomizer.stop();
      }

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
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding-top: 60px;
    overflow: hidden;
  }

  .page-sidebar {
    z-index: 10000;
  }
}
</style>

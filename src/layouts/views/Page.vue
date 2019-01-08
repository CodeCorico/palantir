<template>
  <div id="page">
    <ui-header
      ref="header"
      :upgrade="upgrade"
      @click="headerClick"
    ></ui-header>

    <div class="page-content">
      <router-view></router-view>

      <app-images-randomizer></app-images-randomizer>
    </div>

    <component
      v-for="sidebar in leftSidebars"
      :key="sidebar.id"
      position="left"
      class="page-sidebar"
      :is="sidebar.component"
      :opened="sidebar.opened"
    ></component>

    <component
      v-for="sidebar in rightSidebars"
      :key="sidebar.id"
      position="right"
      class="page-sidebar"
      :is="sidebar.component"
      :opened="sidebar.opened"
    ></component>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
    this.$store.dispatch('Page/addSidebar', {
      location: 'left',
      id: 'menu-sidebar',
      title: 'Menu',
      component: 'menu-sidebar',
      icon: 'fas fa-bars',
    });
    this.$store.dispatch('Page/addSidebar', {
      location: 'right',
      id: 'tasks-sidebar',
      title: 'Tasks',
      component: 'tasks-sidebar',
      icon: 'fas fa-cog',
    });
    this.$store.dispatch('Page/addSidebar', {
      location: 'right',
      id: 'lock-button',
      title: 'Lock',
      handler: this.lockHandler,
      unSelectable: true,
      icon: 'fas fa-lock',
    });

    this.load();
  },
  data() {
    return {
      lastVersionChecked: null,
    };
  },
  computed: {
    ...mapState('Page', ['leftSidebars', 'rightSidebars']),
    upgrade() {
      const { versions } = this.$store.state.Page;

      if (!versions || versions.version === versions.versionLatest) {
        if (this.lastVersionChecked && this.lastVersionChecked !== versions.version) {
          window.location.reload();

          return;
        }

        this.$set(this, 'lastVersionChecked', versions.version);
        return null;
      }

      return versions;
    },
  },
  methods: {
    load() {
      this.checkVersion();
      this.$store.dispatch('Config/load');
    },
    lockHandler() {
      this.$refs.header.toggleLock();
    },
    headerClick() {
      this.$refs.header.toggleLock(false);
    },
    checkVersion() {
      this.$store.dispatch('Page/version');

      // 5min
      setTimeout(() => this.checkVersion(), 5 * 60 * 1000);
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

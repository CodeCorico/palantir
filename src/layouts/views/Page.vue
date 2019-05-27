<template>
  <div id="page" :class="{ locked }">
    <ui-header
      ref="header"
      :upgrade="upgrade"
      @click="headerClick"
    ></ui-header>

    <div class="page-content">
      <router-view></router-view>

      <app-images-randomizer></app-images-randomizer>
      <app-speech-synthesis></app-speech-synthesis>
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
import AppSpeechSynthesis from '@/app-speech-synthesis/views/AppSpeechSynthesis.vue';

export default {
  name: 'page',
  store,
  components: {
    UiHeader,
    MenuSidebar,
    TasksSidebar,
    AppImagesRandomizer,
    AppSpeechSynthesis,
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
      locked: false,
    };
  },
  computed: {
    ...mapState('Page', ['leftSidebars', 'rightSidebars']),
    ...mapState('Config', ['variables']),
    upgrade() {
      const { versions } = this.$store.state.Page;

      if (!versions) {
        return null;
      }

      if (this.hasUpgradeReload) {
        if (this.lastVersionChecked && this.lastVersionChecked !== versions.version) {
          window.location.reload();

          return;
        }

        this.$set(this, 'lastVersionChecked', versions.version);
      }

      if (!this.hasUpgradeButton || !versions || versions.version === versions.versionLatest) {
        return null;
      }

      return versions;
    },
    hasUpgradeButton() {
      return typeof this.variables['upgrade.button'] === 'undefined'
        || this.variables['upgrade.button'];
    },
    hasUpgradeReload() {
      return typeof this.variables['upgrade.reload'] === 'undefined'
        || this.variables['upgrade.reload'];
    },
  },
  methods: {
    load() {
      this.checkVersion();
      this.$store.dispatch('Config/load');
    },
    lockHandler(isSelected) {
      if (!isSelected) {
        return;
      }

      this.lock(true);
    },
    headerClick() {
      this.lock(false);
    },
    lock(value) {
      this.locked = value;
      this.$refs.header.toggleLock(value);

      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 350);
    },
    checkVersion() {
      if (!this.hasUpgradeButton && !this.hasUpgradeReload) {
        return;
      }

      this.$store.dispatch('Page/version');

      // 12h
      setTimeout(() => this.checkVersion(), 3600 * 12* 1000);
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

a, a:hover, a:visited, a:focus, button.link {
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  outline: none;
  color: #fd7d34;
  text-decoration: none;
}

a:hover, button.link:hover {
  color: #ef605c;
}

button.link {
  cursor: pointer;
  display: inline-block;
  margin: 0;
  padding: 0;
  background: none;
  border: 0;
  font-size: 14px;
}
</style>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

#page {
  height: 100%;
  overflow: hidden;

  .page-content {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding-top: 60px;
    overflow: hidden;
    transition: padding-top 0.35s $easeOutQuart;
  }

  .page-sidebar {
    z-index: 10000;
  }

  &.locked {
    .page-content {
      padding-top: 0;
    }
  }
}
</style>

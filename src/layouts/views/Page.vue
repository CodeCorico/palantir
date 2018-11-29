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

    <ui-sidebar
      position="left"
      :opened.sync="sidebarLeftOpened"
      @close="sidebarLeftOpened = false"
    >
      <ui-accordion>
        <h1>Palantir</h1>

        <ui-accordion-item
          title="Dashboards"
          :list="[{
            url: '/',
            icon: 'fas fa-home',
            text: 'Home',
          }, {
            url: '/d/pull-requests',
            icon: 'fas fa-code-branch',
            text: 'Pull requests',
          }, {
            url: '/d/issues',
            icon: 'fas fa-bug',
            text: 'Issues',
          }]"
        ></ui-accordion-item>

        <h1>Websites</h1>

        <ui-accordion-item
          title="Aramisauto"
          :selectors="['v1.0.4 (latest)', 'v1.0.3', 'v1.0.2', 'v1.0.1']"
          :list="[{
            url: '/s/aramisauto-site/docs/latest/readme',
            icon: 'fas fa-book',
            selectors: ['v1.0.4 (latest)'],
            text: 'Documentation',
          }, {
            url: '/s/aramisauto-site/docs/v1.0.3/readme',
            icon: 'fas fa-book',
            selectors: ['v1.0.3'],
            text: 'Documentation',
          }, {
            url: '/s/aramisauto-site/diagrams/latest',
            icon: 'fas fa-project-diagram',
            selectors: ['v1.0.2'],
            text: 'Diagrams',
          }, {
            url: '/s/aramisauto-site/stories/latest',
            icon: 'fas fa-columns',
            selectors: ['v1.0.2'],
            text: 'Stories',
          }, {
            url: '/s/aramisauto-site/changelog/latest',
            icon: 'fas fa-stream',
            selectors: ['v1.0.2'],
            text: 'Changelog',
          }, {
            url: '/s/aramisauto-site/sources/latest',
            icon: 'fab fa-github',
            selectors: ['v1.0.2'],
            text: 'Sources',
          }, {
            url: '/s/aramisauto-site/coverage/latest',
            icon: 'fas fa-file-contract',
            selectors: ['v1.0.2'],
            text: 'Coverage',
          }, {
            url: '/s/aramisauto-site/reports/latest',
            icon: 'fas fa-chart-pie',
            text: 'Reports',
          }, {
            url: '/s/aramisauto-site/ci/latest',
            icon: 'fas fa-code-branch',
            text: 'CI',
          }, {
            url: '//aramisauto.slack.com/messages/CE0NXSDMZ',
            external: true,
            icon: 'fab fa-slack',
            text: 'Support',
          }]"
        ></ui-accordion-item>

        <ui-accordion-item
          title="Cardoen"
          :list="[{
            url: '/s/aramisauto-site/docs/latest/readme',
            icon: 'fas fa-book',
            text: 'Documentation',
          }, {
            url: '/s/aramisauto-site/diagrams/latest',
            icon: 'fas fa-project-diagram',
            text: 'Diagrams',
          }, {
            url: '/s/aramisauto-site/stories/latest',
            icon: 'fas fa-columns',
            text: 'Stories',
          }, {
            url: '/s/aramisauto-site/changelog/latest',
            icon: 'fas fa-stream',
            text: 'Changelog',
          }, {
            url: '/s/aramisauto-site/sources/latest',
            icon: 'fab fa-github',
            text: 'Sources',
          }, {
            url: '/s/aramisauto-site/coverage/latest',
            icon: 'fas fa-file-contract',
            text: 'Coverage',
          }, {
            url: '/s/aramisauto-site/reports/latest',
            icon: 'fas fa-chart-pie',
            text: 'Reports',
          }, {
            url: '/s/aramisauto-site/ci/latest',
            icon: 'fas fa-code-branch',
            text: 'CI',
          }, {
            url: 'https://aramisauto.slack.com/messages/CE0NXSDMZ',
            icon: 'fab fa-slack',
            text: 'Support',
          }]"
        ></ui-accordion-item>

        <h1>Services</h1>

        <ui-accordion-item
          title="Ecommerce"
          :list="[{
            url: '/s/aramisauto-site/docs/latest/readme',
            icon: 'fas fa-book',
            text: 'Documentation',
          }, {
            url: '/s/aramisauto-site/diagrams/latest',
            icon: 'fas fa-project-diagram',
            text: 'Diagrams',
          }, {
            url: '/s/aramisauto-site/stories/latest',
            icon: 'fas fa-columns',
            text: 'Stories',
          }, {
            url: '/s/aramisauto-site/changelog/latest',
            icon: 'fas fa-stream',
            text: 'Changelog',
          }, {
            url: '/s/aramisauto-site/sources/latest',
            icon: 'fab fa-github',
            text: 'Sources',
          }, {
            url: '/s/aramisauto-site/coverage/latest',
            icon: 'fas fa-file-contract',
            text: 'Coverage',
          }, {
            url: '/s/aramisauto-site/reports/latest',
            icon: 'fas fa-chart-pie',
            text: 'Reports',
          }, {
            url: '/s/aramisauto-site/ci/latest',
            icon: 'fas fa-code-branch',
            text: 'CI',
          }, {
            url: 'https://aramisauto.slack.com/messages/CE0NXSDMZ',
            icon: 'fab fa-slack',
            text: 'Support',
          }]"
        ></ui-accordion-item>

        <h1>Libraries</h1>

        <ui-accordion-item
          title="Core SPA"
          :list="[{
            url: '/s/aramisauto-site/docs/latest/readme',
            icon: 'fas fa-book',
            text: 'Documentation',
          }, {
            url: '/s/aramisauto-site/diagrams/latest',
            icon: 'fas fa-project-diagram',
            text: 'Diagrams',
          }, {
            url: '/s/aramisauto-site/stories/latest',
            icon: 'fas fa-columns',
            text: 'Stories',
          }, {
            url: '/s/aramisauto-site/changelog/latest',
            icon: 'fas fa-stream',
            text: 'Changelog',
          }, {
            url: '/s/aramisauto-site/sources/latest',
            icon: 'fab fa-github',
            text: 'Sources',
          }, {
            url: '/s/aramisauto-site/coverage/latest',
            icon: 'fas fa-file-contract',
            text: 'Coverage',
          }, {
            url: '/s/aramisauto-site/reports/latest',
            icon: 'fas fa-chart-pie',
            text: 'Reports',
          }, {
            url: '/s/aramisauto-site/ci/latest',
            icon: 'fas fa-code-branch',
            text: 'CI',
          }, {
            url: 'https://aramisauto.slack.com/messages/CE0NXSDMZ',
            icon: 'fab fa-slack',
            text: 'Support',
          }]"
        ></ui-accordion-item>

      </ui-accordion>
    </ui-sidebar>

    <ui-sidebar
      position="right"
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
import UiAccordion from '@/ui/views/Accordion.vue';
import UiAccordionItem from '@/ui/views/AccordionItem.vue';

export default {
  name: 'page',
  components: {
    UiHeader,
    UiSidebar,
    UiTask,
    UiAccordion,
    UiAccordionItem,
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

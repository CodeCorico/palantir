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
      <router-view></router-view>
    </div>

    <ui-sidebar
      class="page-sidebar-left"
      :opened.sync="sidebarLeftOpened"
      @close="sidebarLeftOpened = false"
    >
      <ui-accordion>
        <h1>Palantir</h1>

        <ui-accordion-item
          title="Dashboards"
          :list="[{
            url: '/d/',
            icon: 'fas fa-home',
            text: 'Home',
          }, {
            url: '/',
            icon: 'fas fa-code-branch',
            text: 'Pull requests',
          }, {
            url: '/',
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
      class="page-sidebar-right"
      :opened.sync="sidebarRightOpened"
      @close="sidebarRightOpened = false"
    >
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

<template>
  <div id="page">
    <ui-header>
      <template slot="left">
        <button @click="sidebarOpened = !sidebarOpened">toggle</button>
      </template>
    </ui-header>

    <div class="page-content">

    </div>

    <ui-sidebar class="page-sidebar-left" :opened="sidebarOpened">
      <template slot="content">
        <h2>Hello</h2>
      </template>
    </ui-sidebar>
  </div>
</template>

<script>
import UiHeader from '@/ui/views/Header.vue';
import UiSidebar from '@/ui/views/Sidebar.vue';

export default {
  name: 'app',
  components: {
    UiHeader,
    UiSidebar,
  },
  data() {
    return {
      sidebarOpened: false,
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

  .page-sidebar-left {
    position: fixed;
    left: 0;
    top: 70px;
    bottom: 0;
  }
}
</style>

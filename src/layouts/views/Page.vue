<template>
  <div id="page">
    <ui-header>

    </ui-header>
    <ui-sidebar>

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
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

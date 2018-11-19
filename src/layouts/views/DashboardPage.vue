<template>
  <div class="dashboard-page">
    <ui-dashboard>
      Hello {{ $route.params.url }}
    </ui-dashboard>
  </div>
</template>

<script>
import UiDashboard from '@/ui/views/Dashboard.vue';

export default {
  name: 'dashboard-page',
  components: {
    UiDashboard,
  },
  created() {
    console.log(this.$route.params);
  },
};
</script>

<style lang="scss" scoped>
.dashboard-page {

}
</style>

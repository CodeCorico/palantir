<template>
  <section class="ui-dashboard">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'ui-dashboard',
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-dashboard {
  position: relative;
}
</style>

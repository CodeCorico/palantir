<template>
  <section class="ui-sidebar" :class="{ opened }">
    <slot name="content"></slot>
  </section>
</template>

<script>
export default {
  name: 'ui-sidebar',
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-sidebar {
  width: 0;
  overflow: hidden;
  background: $colorPanelBg;

  &.opened {
    width: 300px;
  }
}
</style>

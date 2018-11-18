<template>
  <section class="ui-accordion">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'ui-accordion',
  created () {
    this.$on('accordion-item-open', item => this.$emit('accordion-close', item));
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-accordion {
  position: relative;

  > h1 {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.30);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .5px;
    margin-bottom: 12px;
    margin-top: 20px;
  }
}
</style>

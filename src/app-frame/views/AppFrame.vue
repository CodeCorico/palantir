<template>
  <div class="app-frame">
    <iframe
      class="frame"
      :src="config.index"
      :style="`background: ${config.background || 'transparent'};`"></iframe>
  </div>
</template>

<script>
export default {
  name: 'app-pages',
  props: {
    config: Object,
  },
};
</script>

<style lang="scss" scoped>
.app-frame {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    overflow: hidden;
  }
}
</style>

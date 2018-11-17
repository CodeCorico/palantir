<template>
  <header class="ui-header">
    <div class="left">
      <slot name="left"></slot>
    </div>

    <h1>
      <img src="../assets/logo.png" />
      Palantir
    </h1>

    <div class="right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ui-header',
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-header {
  position: relative;
  background: $colorPanelBg;

  .left {
    position: absolute;
    top: 0;
    left: 10px;
  }

  .right {
    position: absolute;
    top: 0;
    right: 10px;
  }

  h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 23px;

    img {
      height: 30px;
      display: inline-block;
      vertical-align: bottom;
    }
  }
}
</style>

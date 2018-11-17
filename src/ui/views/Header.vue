<template>
  <header class="ui-header">
    <h1>Palantir</h1>
  </header>
</template>

<script>
export default {
  name: 'ui-header',
};
</script>

<style scoped>
@import '@/ui/assets/variables.scss';

  position: relative;
  background: $colorPanelBg;

  h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 23px;
  }
</style>

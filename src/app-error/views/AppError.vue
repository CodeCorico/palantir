<template>
  <div class="app-error">
    <div class="content" v-html="error"></div>
  </div>
</template>

<script>
export default {
  name: 'app-error',
  props: {
    config: Object,
  },
  computed: {
    error() {
      return this.config.error.replace(/\n/g, '<br />');
    }
  }
};
</script>

<style lang="scss" scoped>
.app-error {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .content {
    box-sizing: border-box;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    max-width: 900px;
    width: 100%;
    background: #982525;
    font-weight: 700;
    padding: 13px 17px;
    font-size: 13px;
    line-height: 1.5;
    margin-right: 2px;
    border-radius: 4px;
    color: #fff;
    border-bottom: 2px solid #6b1515;
    box-shadow: 0 1px 2px rgba(0,0,0,.5);
  }
}
</style>

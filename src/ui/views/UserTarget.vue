<template>
  <div class="ui-user-target" :class="`type-${type}`" :title="title">
    <div class="user">
      <img :src="avatar" />
    </div>
    <div class="target" v-if="target">
      {{ target }}
    </div>
    <div class="target-dots" v-if="target"></div>
  </div>
</template>

<script>
export default {
  name: 'ui-user-target',
  props: {
    title: String,
    avatar: String,
    target: String,
    type: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-user-target {
  position: relative;
  display: inline-block;
  height: 62px;
  min-width: 48px;
  margin: 0 30px 0 20px;

  .user {
    display: inline-block;
    position: relative;
    margin: 8px 0 0 -10px;
    width: 40px;
    height: 40px;
    transform: rotate(-45deg);
    border: 3px solid #000;
    overflow: hidden;

    img {
      position: absolute;
      transform: rotate(45deg);
      top: -11px;
      left: -9px;
      width: 60px;
      height: 60px;
    }
  }

  .target {
    display: inline-block;
    vertical-align: top;
    margin: 21px 0 0 40px;
    padding: 2px 10px;
    background: #6998fc;
    color: #fff;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
  }

  .target-dots {
    position: absolute;
    top: 29px;
    left: 48px;
    width: 30px;
    height: 0;
    border-top: 3px dotted #6998fc;
  }

  &.type-success {
    .target {
      background: #389393;
    }

    .target-dots {
      border-top-color: #389393;
    }
  }

  &.type-error {
    .target {
      background: #f39d4c;
    }

    .target-dots {
      border-top-color: #f39d4c;
    }
  }
}
</style>

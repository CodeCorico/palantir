<template>
  <section class="ui-sidebar" :class="[`position-${position}`, `open-sb-${openSb}`]">
    <div class="container">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ui-sidebar',
  props: {
    position: {
      type: String,
      required: true,
      validator: value => ['left', 'right'].indexOf(value) > -1,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return  {
      openSb: 0,
      openSbTimeout: null,
    };
  },
  created () {
    this.$on('naviguate', () => this.$emit('close'));
  },
  methods: {
    toggleStoryboard(open) {
      clearTimeout(this.openSbTimeout);

      if (open) {
        this.$set(this, 'openSb', 1);

        this.openSbTimeout = setTimeout(() => {
          this.$set(this, 'openSb', 2);
        }, 250);
      } else {
        this.$set(this, 'openSb', 3);

        this.openSbTimeout = setTimeout(() => {
          this.$set(this, 'openSb', 4);

          this.openSbTimeout = setTimeout(() => {
            this.$set(this, 'openSb', 0);
          }, 250);
        }, 350);
      }
    },
  },
  watch: {
    opened(value) {
      this.toggleStoryboard(value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-sidebar {
  position: fixed;
  top: 80px;
  bottom: 20px;
  width: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 0;
    // background: $colorPanelDarker;
    background: rgba($colorPanelDarker, 0.7);
    transition: all 0.25s $easeOutQuart;
  }

  &.position-left {
    left: 20px;
  }

  &.position-right {
    right: 20px;
  }

  .container {
    position: relative;
    opacity: 0;
    transform: translateX(-50px);
    transition: all .35s $easeOutCirc;
    padding: 10px;
  }

  &.open-sb-1, &.open-sb-2, &.open-sb-3, &.open-sb-4 {
    width: 350px;
  }

  &.open-sb-1, &.open-sb-2, &.open-sb-3 {
    &::before {
      left: 0;
      width: 100%;
    }
  }

  &.open-sb-2 {
    .container {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
</style>

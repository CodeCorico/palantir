<template>
  <header class="ui-header" :class="[`appear-sb-${appearSb}`]">
    <div class="left">
      <slot name="left"></slot>
    </div>

    <h1>
      <div class="logo">
        <div class="logo-container">
          <div class="logo-align">
            <div class="logo-content">
              <img class="logo-img" src="../assets/logo.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="title">
        Palantir
      </div>
    </h1>

    <div class="right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ui-header',
  data() {
    return  {
      appearSb: 0,
    };
  },
  methods: {
    appear(step, max, duration) {
      if (step > max) {
        return;
      }

      setTimeout(() => {
        this.$set(this, 'appearSb', step);

        this.appear(++step, max, 250);
      }, duration);
    },
  },
  mounted() {
    this.appear(1, 3, 0);
  }
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-header {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  // background: $colorPanelLighter;
  background: rgba($colorPanelDarker, 0.7);
  transition: height 0.25s $easeOutQuart;

  &.appear-sb-1, &.appear-sb-2, &.appear-sb-3 {
    height: 60px;

    h1 {
      .logo {
        opacity: 1;
        transform: translateY(0) translateX(47px);
      }
    }
  }

  &.appear-sb-2, &.appear-sb-3 {
    h1 {
      .logo {
        transform: translateY(0) translateX(0);
      }

      .title {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }

  &.appear-sb-3 {
    height: 60px;
  }

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
    user-select: none;
    position: absolute;
    top: 16px;
    left: 50%;
    height: 25px;
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif;
    font-size: 23px;

    .logo, .title {
      transition: all 0.25s $easeOutQuart;
    }

    .logo {
      user-select: none;
      position: relative;
      opacity: 0;
      float: left;
      width: 80px;
      height: 80px;
      margin: -26px 10px 0 0;
      transform: translateY(-70px) translateX(47px);

      .logo-container {
        position: absolute;
        top: 40px;
        left: 0;
        width: 50px;
        height: 50px;
        border: 3px solid #000;
        transform: rotate(-45deg);
        overflow: hidden;
        transform-origin: top left;
      }

      .logo-align {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(45deg);
        transform-origin: top left;
      }

      .logo-content {
        position: absolute;
        top: -35px;
        left: 0px;
        width: 71px;
        height: 71px;
        background: #383838;
      }

      .logo-img {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 60px;
        height: 60px;
      }
    }

    .title {
      float: left;
      transform: translateX(-47px);
      opacity: 0;
    }
  }
}
</style>

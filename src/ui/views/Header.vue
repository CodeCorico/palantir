<template>
  <header class="ui-header" :class="[`appear-sb-${appearSb}`]">
    <div class="left">
      <button
        v-for="buttonLeft in mapButtons('left')"
        :key="buttonLeft.title"
        class="header-button"
        :class="{ active: buttonLeft.active }"
        @click="toggleButton('left', buttonLeft)"
      >
        <i :class="buttonLeft.icon"></i>
      </button>
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
      <button
        v-for="buttonRight in mapButtons('right')"
        :key="buttonRight.title"
        class="header-button"
        :class="{ active: buttonRight.active }"
        @click="toggleButton('right', buttonRight)"
      >
        <i :class="buttonRight.icon"></i>
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ui-header',
  props: {
    buttons: Array,
  },
  data() {
    return  {
      localButtons: this.buttons,
      appearSb: -1,
      buttonsArgs: {
        left: {},
        right: {},
      },
    };
  },
  methods: {
    toggleButton(location, button) {
      const active = !button.active;
      const buttonsArgs = Object.assign({}, this.buttonsArgs);

      Object.keys(buttonsArgs[location]).forEach(key => {
        const but = buttonsArgs[location][key];

        buttonsArgs[location][key].active = but === button ? active : false;
      });

      this.$emit(`button${active ? 'Open' : 'Close'}`, button);

      this.$set(this, 'buttonsArgs', buttonsArgs);
    },
    mapButtons(location) {
      const buttonsArgs = this.buttonsArgs[location];

      return (this.localButtons || [])
        .filter(button => button.location === location)
        .map((button) => {
          buttonsArgs[button.title] = buttonsArgs[button.title] || {};
          return Object.assign(buttonsArgs[button.title], button);
        });
    },
    appear(steps, step = 0) {
      if (step >= steps.length) {
        return;
      }

      setTimeout(() => {
        this.$set(this, 'appearSb', step);

        this.appear(steps, ++step);
      }, steps[step]);
    },
  },
  mounted() {
    this.appear([0, 150, 200]);
  }
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-header {
  z-index: 1000;
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  // background: $colorPanelLighter;
  background: rgba($colorPanelDarker, 0.7);
  transition: height 0.35s $easeOutQuart;

  &.appear-sb-0, &.appear-sb-1, &.appear-sb-2 {
    h1 {
      .logo {
        opacity: 1;
        transform: translateY(0) translateX(47px);
      }
    }
  }

  &.appear-sb-1, &.appear-sb-2 {
    height: 60px;
  }

  &.appear-sb-2 {
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

  .left, .right {
    position: absolute;
    bottom: 0;
  }

  .left {
    left: 10px;
  }

  .right {
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
      transition: all 0.35s $easeOutQuart;
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

  .header-button {
    cursor: pointer;
    outline: none;
    padding: 20px;
    border: 0;
    background: none;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
    height: 60px;

    &.active {
      color: #fff;
    }
  }
}
</style>

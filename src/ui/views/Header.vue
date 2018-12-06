<template>
  <header
    class="ui-header"
    :class="[`appear-sb-${appearSb}`, { bigger: biggerMode }]"
    @click.self="$emit('click')"
  >
    <div class="left">
      <button
        v-for="buttonLeft in mapButtons('left')"
        :key="buttonLeft.title"
        class="header-button"
        :class="{ active: buttonLeft.active, hide: buttonLeft.hide }"
        @click="toggleButton('left', buttonLeft)"
      >
        <i :class="buttonLeft.icon"></i>
      </button>
    </div>

    <h1 @click="$emit('click')">
      <div class="logo">
        <div class="logo-container">
          <div class="logo-align">
            <div class="logo-content">
              <img class="logo-img" src="../assets/logo.png" />
            </div>
          </div>
        </div>
      </div>

      <div class="title">Palantir</div>
    </h1>

    <div class="right">
      <button
        v-for="buttonRight in mapButtons('right')"
        :key="buttonRight.title"
        class="header-button"
        :class="{ active: buttonRight.active, hide: buttonRight.hide }"
        @click="toggleButton('right', buttonRight)"
      >
        <i :class="buttonRight.icon"></i>
      </button>
    </div>

    <div class="date-time">{{ dateTime }}</div>
  </header>
</template>

<script>
export default {
  name: 'ui-header',
  props: {
    buttons: Array,
  },
  destroyed() {
    clearTimeout(this.dateTimeTimeout);
  },
  data() {
    return  {
      dateTimeTimeout: null,
      dateTime: null,
      localButtons: this.buttons,
      appearSb: -1,
      biggerMode: false,
      buttonsArgs: {
        left: {},
        right: {},
      },
    };
  },
  methods: {
    bigger(value = true) {
      this.$set(this, 'biggerMode', value);
    },
    eachButton(eachFunc, update, location) {
      const buttonsArgs = Object.assign({}, this.buttonsArgs);

      (location ? [location] : Object.keys(buttonsArgs)).forEach(location => {
        Object.keys(buttonsArgs[location]).forEach(key => {
          eachFunc(buttonsArgs[location][key]);
        });
      });

      if (update) {
        this.$set(this, 'buttonsArgs', buttonsArgs);
      }

      return buttonsArgs;
    },
    closeAllButtons(except) {
       this.eachButton((button) => {
        if (except && (button.name || '') === except) {
          return;
        }

        button.active = false;
      }, true);
    },
    hideButtons(except) {
      this.eachButton((button) => {
        if (except && (button.name || '') === except) {
          return;
        }

        button.hide = true;
      }, true);
    },
    showButtons() {
      this.eachButton((button) => {
        button.hide = false;
      }, true);
    },
    toggleButton(location, targetButton) {
      const active = !targetButton.active;
      this.eachButton((button) => {
        button.active = button === targetButton ? active : false;
      }, true, location);

      this.$emit(`button${active ? 'Open' : 'Close'}`, targetButton);
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
    dateTimeClock() {
      clearTimeout(this.dateTimeTimeout);

      const date = new Date();

      const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const months = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

      this.$set(this, 'dateTime', `${hours}:${minutes} ${months}/${day}`);

      this.dateTimeTimeout = setTimeout(() => this.dateTimeClock(), 60 * 1000); // 1min
    },
  },
  mounted() {
    this.dateTimeClock();

    this.appear([0, 150, 200]);
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

@keyframes header-button-show {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes header-button-hide {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0); opacity: 0; }
}

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
    right: 130px;
  }

  &.bigger {
    .date-time {
      font-size: 22px;
      bottom: 16px;
    }
  }

  .date-time {
    position: absolute;
    bottom: 20px;
    right: 30px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    transition: font-size 0.25s $easeOutQuart, bottom 0.25s $easeOutQuart;
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
    font-size: 23px;
    font-weight: 500;

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
    transform: scale(0);
    opacity: 0;
    animation: header-button-show 0.35s $easeOutQuart forwards;

    &.hide {
      animation: header-button-hide 0.35s $easeOutQuart forwards;
    }

    &.active {
      color: #fff;
    }
  }
}
</style>

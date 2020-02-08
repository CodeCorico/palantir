<template>
  <header
    class="ui-header"
    :class="[`appear-sb-${appearSb}`, { locked }]"
    @click.self="$emit('click')"
  >
    <div class="left">
      <button
        v-for="button in leftButtons"
        :key="button.id"
        class="header-button"
        :class="{ selected: button.selected, hidden: button.hidden }"
        @click="toggleButton('left', button.id)"
      >
        <i :class="button.icon"></i>
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

      <div class="title" :class="{date : locked}">{{ locked ? dateTime : 'Palantir' }}</div>
    </h1>

    <div class="right">
      <button
        v-for="button in rightButtons"
        :key="button.id"
        class="header-button"
        :class="{ selected: button.selected, hidden: button.hidden }"
        @click="toggleButton('right', button.id)"
      >
        <i :class="button.icon"></i>
      </button>

      <a
        v-if="upgrade"
        :href="upgrade.link"
        target="_blank"
        :title="
          `Your Palantir (${upgrade.version}) is out of date ` +
          ` with the latest version (${upgrade.versionLatest})`
        "
        class="header-button upgrade"
      >
        <i class="fas fa-angle-double-up"></i>
      </a>
    </div>

    <div class="date-time">{{ dateTime }}</div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'ui-header',
  store,
  destroyed() {
    clearTimeout(this.dateTimeTimeout);
  },
  props: {
    upgrade: Object,
  },
  data() {
    return  {
      locked: false,
      dateTimeTimeout: null,
      dateTime: null,
      appearSb: -1,
    };
  },
  computed: {
    ...mapState('Page', ['leftButtons', 'rightButtons']),
  },
  methods: {
    toggleLock(force) {
      this.$set(this, 'locked', typeof force === 'boolean' ? force : !this.locked);

      this.$store.dispatch(`Page/${this.locked ? 'hide' : 'show'}Buttons`);
    },
    toggleButton(location, id) {
      this.$store.dispatch('Page/toggleButton', { location, id });
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
  transition: height 0.35s $easeOutQuart, top 0.35s $easeOutQuart;

  &.appear-sb-0, &.appear-sb-1, &.appear-sb-2 {
    .logo {
      opacity: 1;
      transform: translateY(0) translateX(47px);
    }
  }

  &.appear-sb-1, &.appear-sb-2 {
    height: 60px;
  }

  &.appear-sb-2 {
    .logo {
      transform: translateY(0) translateX(0);
    }

    .title {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .left, .right {
    position: absolute;
    bottom: 0;
  }

  .left {
    left: 10px;
    transition: left 0.35s $easeOutQuart;
  }

  .right {
    right: 130px;
    transition: right 0.35s $easeOutQuart;
  }

  &.locked.appear-sb-2 {
    top: -60px;

    @keyframes header-lock {
      49% { top: 16px; left: 50%; transform: translateX(-50%); }
      50% { top: 16px; left: 100%; transform: translateX(-100%); }
      100% { top: 76px; left: 100%; transform: translateX(-100%); }
    }

    h1 {
      cursor: pointer;
      animation: header-lock 1s $easeOutQuart forwards;
    }

    @keyframes logo-lock {
      49% { position: relative; top: auto; right: auto; margin: -26px 10px 0 0; transform: translateY(-70px) translateX(47px); }
      50% { position: absolute; top: -18px; right: -2px; margin: 0; transform: scale(0.7); }
      100% { position: absolute; top: -18px; right: -2px; margin: 0; transform: scale(0.7); }
    }

    .logo {
      z-index: 1;
      animation: logo-lock 1s $easeOutQuart forwards;
    }

    @keyframes title-lock {
      49% { width: auto; margin-top: 0; padding: 0; font-size: 23px; background: none; }
      50% { width: 118px; margin-top: 5px; padding: 5px 25px 5px 10px; font-size: 19px; background: $colorBg; }
      100% { width: 118px; margin-top: 5px; padding: 5px 25px 5px 10px; font-size: 19px; background: $colorBg; }
    }

    @keyframes fadeOut {
      99% { visibility: hidden; }
      100% { visibility: visible; }
    }

    .title {
      animation: title-lock 1s $easeOutQuart forwards;

      &.date {
        position: relative;
        top: 10px;
        visibility: hidden;
        animation: 0.5s fadeOut;
        animation-fill-mode: forwards;
      }
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
    width: 194px;
    transform: translateX(-50%);
    margin: 0;
    padding: 0;
    font-weight: 500;
  }

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
    font-size: 23px;
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

    &.hidden {
      animation: header-button-hide 0.35s $easeOutQuart forwards;
    }

    &.selected {
      color: #fff;
    }
  }

  .upgrade {
    color: #4cbaab;
  }
}
</style>

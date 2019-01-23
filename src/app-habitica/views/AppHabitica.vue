<template>
  <div class="app-habitica">
    <div class="members">
      <div v-for="member in members" :key="member.id" class="member">

        <div class="username">{{ member.username }}</div>
        <div class="life-bar">
          <div class="life-bar-fill" :style="`width: ${hpPercent(member)}%;`"></div>
        </div>

        <div data-app-habitica class="avatar" style="padding-top: 0px;">
          <div data-app-habitica class="character-sprites" style="margin: 0px auto 0px 24px;">

            <span data-app-habitica v-if="member.mount"
              :class="`Mount_Body_${member.mount}`"
            ></span>

            <span data-app-habitica :class="`hair_flower_${member.preferences.hair.flower}`"></span>

            <span data-app-habitica
              :class="[`chair_${member.preferences.chair}`, specialMountClass(member)]"
            ></span>
            <span data-app-habitica
              :class="[getGearClass(member, 'back'), specialMountClass(member)]"
            ></span>
            <span data-app-habitica :class="[skinClass(member), specialMountClass(member)]"></span>
            <span data-app-habitica
              :class="[
                `${member.preferences.size}_shirt_${member.preferences.shirt}`,
                specialMountClass(member)
              ]"
            ></span>
            <span data-app-habitica :class="['head_0', specialMountClass(member)]"></span>
            <span data-app-habitica
              :class="[
                `${member.preferences.size}_${getGearClass(member, 'armor')}`,
                specialMountClass(member)
              ]"
            ></span>
            <span data-app-habitica
              :class="[getGearClass(member, 'back_collar'), specialMountClass(member)]"
            ></span>

            <template v-for="type in ['bangs', 'base', 'mustache', 'beard']">
              <span data-app-habitica :key="type"
                :class="[
                  `hair_${type}_${member.preferences.hair[type]}_${member.preferences.hair.color}`,
                  specialMountClass(member)
                ]"
              ></span>
            </template>

            <span data-app-habitica
              :class="[getGearClass(member, 'body'), specialMountClass(member)]"
            ></span>
            <span data-app-habitica
              :class="[getGearClass(member, 'eyewear'), specialMountClass(member)]"
            ></span>
            <span data-app-habitica
              :class="[getGearClass(member, 'head'), specialMountClass(member)]"
            ></span>
            <span data-app-habitica
              :class="[getGearClass(member, 'headAccessory'), specialMountClass(member)]"
            ></span>
            <span data-app-habitica
              :class="[`hair_flower_${member.preferences.hair.flower}`, specialMountClass(member)]"
            ></span>
            <span data-app-habitica
              :class="[getGearClass(member, 'shield'), specialMountClass(member)]"
            ></span>
            <span data-app-habitica
              :class="[getGearClass(member, 'weapon'), specialMountClass(member)]"
            ></span>

            <span data-app-habitica class="zzz" v-if="member.preferences.sleep"></span>

            <span data-app-habitica v-if="member.mount"
              :class="`Mount_Head_${member.items.currentMount}`"
            ></span>

            <span data-app-habitica v-if="member.items.currentPet"
              class="current-pet" :class="`Pet-${member.items.currentPet}`"
            ></span>
          </div>
        </div>

        <div class="member-shadow" :class="{ mount: member.mount }"></div>
      </div>
    </div>

    <div v-if="quest" class="boss-container">
      <div class="boss">
        <div class="boss-life-bar">
          <div class="life-bar-fill" :style="`width: ${bossHpPercent}%;`"></div>
          <div
            class="life-bar-pending"
            :style="`left: ${bossHpPercent}%; width: ${bossPendingPercent}%;`"
          ></div>
        </div>

        <div data-app-habitica class="quest-boss" :class="[`quest_${quest.key}`]"></div>
      </div>

      <div class="boss-shadow"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'app-habitica',
  store,
  destroyed() {
    const head = document.getElementsByTagName('head')[0];
    const style = document.getElementById('app-habitica-css');

    if (style) {
      head.removeChild(style);
    }

    this.$store.dispatch('Habitica/clear');
  },
  props: {
    config: Object,
  },
  watch: {
    css(css) {
      const head = document.getElementsByTagName('head')[0];
      let style = document.getElementById('app-habitica-css');

      if (style) {
        head.removeChild(style);
      }

      if (!css) {
        return;
      }

      style = document.createElement('style');
      style.id = 'app-habitica-css';
      style.innerHTML = css;
      head.append(style, head.children[0]);
    },
  },
  computed: {
    ...mapState('Habitica', ['quest', 'members', 'css']),
    bossHpPercent() {
      return Math.round(((this.quest.hp - this.quest.pending) * 100 / this.quest.hpMax));
    },
    bossPendingPercent() {
      return Math.round((this.quest.pending * 100 / this.quest.hpMax));
    }
  },
  methods: {
    hpPercent(member) {
      return Math.round(member.hp * 100 / member.hpMax);
    },
    skinClass(member) {
      const baseClass = `skin_${member.preferences.skin}`;

      return `${baseClass}${member.preferences.sleep ? '_sleep' : ''}`;
    },
    specialMountClass(member) {
      if (member.mount && member.mount.indexOf('Kangaroo') > -1) {
        return 'offset-kangaroo';
      }
    },
    costumeClass(member) {
      return member.preferences.costume ? 'costume' : 'equipped';
    },
    getGearClass(member, gearType) {
      return member.items.gear[this.costumeClass(member)][gearType];
    },
  },
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'pixel';
  src: url('../assets/pixel.eot');
  src: url('../assets/pixel.eot?#iefix') format('embedded-opentype'),
    url('../assets/pixel.woff2') format('woff2'),
    url('../assets/pixel.woff') format('woff'),
    url('../assets/pixel.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@keyframes boss-updown {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

@keyframes boss-shadow-updown {
  from { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.5); opacity: 1; }
  to { box-shadow: 0 0 13px 9px rgba(0, 0, 0, 0.5); opacity: 0.5; }
}

.app-habitica {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  font-family: 'pixel', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 11px;
  color: #fff;
  text-shadow: -1px 0 0 #000, 0 -1px 0 #000, 2px 0 1px #000, 0 2px 1px #000;
  text-decoration: none;

  .avatar {
    position: relative;
    top: auto;
    left: auto;
  }

  .members {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .member {
      position: relative;
      width: 140px;
      padding-top: 15px;
      color: white;

      .username {
        width: 80px;
        height: 21px;
        margin: 0 auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }

      .member-shadow {
        z-index: -1;
        position: absolute;
        bottom: 54px;
        left: 60px;
        width: 40px;
        height: 10px;
        margin: 10px auto 0;
        border-radius: 50%;
        background: #000;
        box-shadow: 0 0 13px 9px rgba(0, 0, 0, 0.5);
        opacity: 0.4;

        &.mount {
          left: 47px;
          bottom: 18px;
          width: 80px;
          height: 20px;
           opacity: 0.5;
        }
      }
    }
  }

  .boss-container {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 10px;

    .boss {
      animation: boss-updown 2s linear alternate infinite;

      .quest-boss {
        margin: 0 auto;
      }
    }

    .boss-shadow {
      width: 80px;
      height: 15px;
      margin: 10px auto 0;
      border-radius: 50%;
      background: #000;
      animation: boss-shadow-updown 2s linear alternate infinite;
    }
  }

  .life-bar, .boss-life-bar {
    position: relative;
    width: 80px;
    height: 8px;
    background: #444e52;
    margin: 0 auto 10px;
    border-radius: 3px;
    overflow: hidden;

    .life-bar-fill {
      height: 100%;
      background: #fc1838;
    }

    .life-bar-pending {
      position: absolute;
      top: 0;
      height: 100%;
      background: #ffd200;
    }
  }

  .boss-life-bar {
    width: 200px;
    height: 12px;
  }
}
</style>

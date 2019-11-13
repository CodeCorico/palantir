<template>
  <div class="app-trello" :class="[`orientation-${config.orientation || 'left'}`]">
    <div class="status-bar"></div>

    <div class="cards">
      <div v-for="card in cards" :key="card.id" class="card"
          :style="`background: ${card.color}33; box-shadow: 0 0 7px 5px ${card.color}7d`">
        <div class="members">
          <div v-for="member in card.members" :key="member.id" class="member">
            <img :src="`${member.avatarUrl}/50.png`" />
          </div>
        </div>

        <div v-if="card.done" class="status"></div>

        <div class="name">{{ card.name }}</div>

        <i class="done fas fa-check" v-if="card.done"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'app-trello',
  store,
  props: {
    config: Object,
  },
  destroyed() {
    this.$store.dispatch('Trello/clear');
  },
  computed: {
    ...mapState('Trello', ['cards']),
  },
  methods: {
    statusStyle(color = '#61aaeb') {
      return {
        background: color,
        'box-shadow': `0 0 7px 5px ${color}33`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.app-trello {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .cards {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  .status-bar {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 124px;
    bottom: 0;
    width: 1px;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 7px 5px rgba(255, 255, 255, 0.2);
    opacity: 0.3;
  }

  .card {
    position: relative;
    margin: 20px 10px;
    padding: 5px;
    background: #27828233;
    box-shadow: #2782827d 0px 0px 7px 5px;
  }

  .name {
    box-sizing: border-box;
    width: 100%;
    padding-right: 70px;
    padding-left: 139px;
    font-size: 16px;
  }

  .status {
    position: absolute;
    top: -5px;
    bottom: -5px;
    left: 112px;
    width: 5px;
    border-radius: 5px;
    background: #61bd4f;
    box-shadow: #61bd4f33 0px 0px 7px 5px;
  }

  .members {
    position: absolute;
    top: 50%;
    left: 0;
    width: 90px;
    transform: translateY(-50%);
    margin-top: 2px;
    text-align: right;

    .member {
      display: inline-block;
      position: relative;
      margin-left: -10px;
      width: 18px;
      height: 18px;
      transform: rotate(-45deg);
      border: 3px solid #000;
      overflow: hidden;

      img {
        position: absolute;
        transform: rotate(45deg);
        top: -5px;
        left: -6px;
        width: 29px;
        height: 29px;
      }
    }
  }

  .done {
    position: absolute;
    bottom: -20px;
    right: 0;
    color: #61bd4f;
    font-size: 70px;
  }

  &.orientation-right {
    .cards {
      left: auto;
      right: 0;
    }

    .status-bar {
      left: auto;
      right: 124px;
    }

    .name {
      text-align: right;
      padding-left: 70px;
      padding-right: 139px;
    }

    .status {
      left: auto;
      right: 112px;
    }

    .members {
      left: auto;
      right: 0;
      text-align: left;

      .member {
        margin: 0 -10px 0 0;
      }
    }

    .done {
      right: auto;
      left: 0;
    }
  }
}
</style>

<template>
  <div class="app-github-pulls">
    <ui-scrolls ref="scrolls" class="scrolls" content-display="table">
      <div class="scrolls-content">

        <div v-for="group in groups" :key="group.id" class="pull-group">
          <div class="pull-group-title">
            <h2>{{ group.title }}</h2>
          </div>

          <a
            v-for="pull in group.pulls"
            :key="pull.id"
            :href="pull.url"
            target="_blank"
            class="pull"
            :class="[
              pull.type,
              pullsCache[pull.id] && pullsCache[pull.id].changeState
                ? `change-state-${pullsCache[pull.id].changeState}`
                : ''
            ]"
            :style="{
              'animation-delay': `${pull.animationDelay}ms`,
              'animation-duration': `${pull.animationDuration}ms`,
            }"
          >
            <div
              v-if="pullsCache[pull.id] && pullsCache[pull.id].changeState === 'new'"
              class="pull-new-anim"
            ></div>

            <a
              v-for="reviewer in pull.reviewers"
              :key="reviewer.id"
              :href="reviewer.url"
              target="_blank"
              class="pull-reviewer"
              :class="[`r-${reviewer.spaceIndex}`]"
            >
              <div class="pull-reviewer-container">
                <div class="pull-reviewer-align">
                  <div class="pull-reviewer-content">
                    <img class="pull-reviewer-img" :src="reviewer.img" />
                  </div>
                </div>
              </div>
            </a>

            <h3><span>{{ pull.scope }}</span></h3>
            <div class="pull-content">
              <div
                class="pull-background"
                :style="{ 'background-image': `url(${pull.authorImg})` }"
              ></div>

              <div
                v-if="pull.mergeableState !== 'clean'"
                class="pull-state"
                :class="[`state-${pull.mergeableState}`]"
              >
                <i
                  v-if="pull.mergeableState === 'dirty' || pull.mergeableState === 'behind'"
                  class="fas fa-code-branch"
                ></i>
                <i v-if="pull.mergeableState === 'unstable'" class="fas fa-skull-crossbones"></i>
                <i v-if="pull.mergeableState === 'comments'" class="fas fa-comment-alt"></i>
              </div>

              <github-pull-chart :values="pull.lines"></github-pull-chart>

              <div class="pull-number">#{{ pull.number }}</div>
            </div>
          </a>

          <div class="pulls-clear"></div>
        </div>

      </div>
    </ui-scrolls>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiScrolls from '@/ui/views/Scrolls.vue';
import GithubPullChart from './GithubPullChart.vue';

export default {
  name: 'app-github-pulls',
  store,
  components: {
    GithubPullChart,
    UiScrolls,
  },
  props: {
    config: Object,
  },
  watch: {
    changes() {
      this.playChanges();
    },
  },
  data() {
    return {
      pullsCache: {},
    };
  },
  computed: {
    ...mapState('GithubPulls', ['changes']),
    groups() {
      this.$nextTick(() => this.$refs.scrolls.refresh());

      return this.$store.state.GithubPulls.groups;
    },
  },
  methods: {
    playChanges() {
      const changesEvents = ['new', 'unclean', 'merged'];

      for (let i = 0; i < changesEvents.length; i++) {
        const name = changesEvents[i];

        if (this.changes.indexOf(name) > -1 && this.config.sounds && this.config.sounds[name]) {
          const audio = new Audio(this.config.sounds[name]);
          audio.loop = false;
          // eslint-disable-next-line no-console
          audio.play().catch(() => console.warn(
            `Impossible to play "${this.config.sounds[name]}"`,
            `(maybe the user didn't interact with the page)`
          ));

          break;
        }
      }

      const isNew = this.changes.indexOf('new') > -1;
      const isInit = this.changes.indexOf('init') > -1;

      if (isNew || isInit) {
        const { groups } = this.$store.state.GithubPulls;
        const pullsCache = {};

        groups.forEach(group => group.pulls.forEach((pull) => {
          if (this.pullsCache[pull.id]) {
            pullsCache[pull.id] = this.pullsCache[pull.id];
          } else if (isInit) {
            pullsCache[pull.id] = { changeState: 'idle' };
          } else if (isNew) {
            pullsCache[pull.id] = { changeState: '' };
            this.$nextTick(() => {
              pullsCache[pull.id].changeState = 'new';
              setTimeout(() => this.resetChangeState(pull.id, 'new'), 1000);
            });
          }
        }));

        this.$set(this, 'pullsCache', pullsCache);
      }
    },
    resetChangeState(pullId, changeState) {
      if (!this.pullsCache[pullId] || this.pullsCache[pullId].changeState !== changeState) {
        return;
      }

      this.pullsCache[pullId].changeState = 'idle';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

$pullReviewerAnimationCount: 10;

@keyframes github-pull-alert {
  from { transform: scale(1); }
  50% { transform: scale(2); }
  to { transform: scale(1); }
}

@keyframes pull-updown {
  from { transform: translateY(0); }
  to { transform: translateY(10px); }
}

@keyframes pull-state-animation {
  from { opacity: 0.9; }
  50% { opacity: 0.2; }
  to { opacity: 0.9; }
}

@keyframes pull-new-anim-notif {
  0% { opacity: 0; width: 150px; height: 180px; transform: translateY(1px) translateX(1px); }
  49% { opacity: 0; width: 150px; height: 180px; transform: translateY(1px) translateX(1px); }
  50% { opacity: 1; width: 150px; height: 180px; transform: translateY(1px) translateX(1px); }
  75% { opacity: 0; width: 200px; height: 230px; transform: translateY(-25px) translateX(-25px); }
  76% { opacity: 1; width: 150px; height: 180px; transform: translateY(1px) translateX(1px); }
  100% { opacity: 0; width: 200px; height: 230px; transform: translateY(-25px) translateX(-25px); }
}

@for $i from 0 through $pullReviewerAnimationCount {
  $rotate: round($i * 360 / $pullReviewerAnimationCount);

  @keyframes github-pull-reviewer-#{$i} {
    from { transform: rotate(0deg + $rotate); }
    to { transform: rotate(360deg + $rotate); }
  }

  @keyframes github-pull-reviewer-stable-#{$i} {
    from { transform: rotate(315deg - $rotate); }
    to { transform: rotate(-45deg - $rotate); }
  }
}

.app-github-pulls {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .scrolls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .scrolls-content {
      padding: 30px 50px;
    }
  }

  .pull-group {
    position: relative;
    float: left;
    margin: 0 40px 40px 0;

    .pull-group-title {
      height: 37px;
    }

    h2 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 37px;
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 15px;
      font-weight: 600;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
    }

    .pulls-clear {
      clear: both;
    }
  }

  .pull, .pull:hover, .pull:visited, .pull:focus {
    color: white;
    text-decoration: none;
  }

  .pull-new-anim {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    border: 5px solid #62bbe3;
    border-radius: 5px;
    opacity: 0;
    animation: pull-new-anim-notif 1s $easeOutQuart infinite;
  }

  .pull {
    position: relative;
    display: block;
    float: left;
    width: 150px;
    height: 180px;
    margin: 0 25px 0 0;
    border-radius: 5px;
    transform: scale(0);
    opacity: 0;

    &.change-state-idle {
      transform: scale(1);
      opacity: 1;
      box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
      animation: pull-updown 4s linear alternate infinite;
    }

    &.change-state-new {
      transform: scale(1);
      opacity: 1;
      box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
      transition: all 0.4s $easeOutBackHard;
    }

    &.warning h3 {
      background: linear-gradient(45deg, #fc9b00 0%,#ffb200 100%);
    }

    &.alert h3 {
      background: linear-gradient(45deg, #c93534 0%, #a71918 100%);

      span {
        animation: github-pull-alert 1.5s linear infinite;
      }
    }

    .pull-state {
      position: absolute;
      bottom: 5px;
      left: 10px;
      font-size: 30px;

      i {
        animation: pull-state-animation 1.75s linear infinite;

        &::after {
          z-index: -1;
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateY(-50%) translateX(-50%);
          width: 0;
          height: 0;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 20px 20px rgba(255, 255, 255, 0.2)
        }
      }

      &.state-comments, &.state-dirty, &.state-behind {
        color: #f7ba3d;
      }

      &.state-unstable {
        color: #f73f3d;
      }
    }

    h3 {
      box-sizing: border-box;
      height: 30px;
      margin: 0;
      padding: 6px 0 0;
      color: white;
      text-align: center;
      text-transform: uppercase;
      background: linear-gradient(45deg, #229cc8 0%, #4bd1c4 100%);
      font-size: 14px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      overflow: hidden;

      span {
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
      }
    }

    .pull-content {
      position: relative;
      width: 150px;
      height: 150px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      overflow: hidden;

      .pull-background {
        z-index: -1;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        opacity: 0.5;
      }

      .pull-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        color: white;
        font-weight: 400;
        font-size: 24px;
        text-shadow: 2px 4px 5px rgba(0, 0, 0, 0.8);
      }
    }

    .pull-reviewer, .pull-reviewer:hover, .pull-reviewer:visited, .pull-reviewer:focus {
      color: white;
      text-decoration: none;
    }

    .pull-reviewer {
      z-index: 1;
      user-select: none;
      display: block;
      position: absolute;
      top: -36px;
      left: -36px;
      width: 66px;
      height: 66px;
      transform-origin: 78px 125px;

      @for $i from 0 through $pullReviewerAnimationCount {
        $sec: (10s + $i);

        &.r-#{$i} {
          animation: github-pull-reviewer-#{$i} $sec linear infinite;

          .pull-reviewer-container {
            animation: github-pull-reviewer-stable-#{$i} $sec linear infinite;
          }
        }
      }

      .pull-reviewer-container {
        position: absolute;
        top: 33px;
        left: 33px;
        width: 40px;
        height: 40px;
        border: 3px solid #000;
        background: #000;
        // transform: rotate(-45deg);
        overflow: hidden;
        transform-origin: top left;
        box-shadow: 0 14px 51px rgba(0, 0, 0, 0.8);
      }

      .pull-reviewer-align {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(45deg);
        transform-origin: top left;
      }

      .pull-reviewer-content {
        position: absolute;
        top: -33px;
        left: -2px;
        width: 62px;
        height: 64px;
        background: #383838;
      }

      .pull-reviewer-img {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>

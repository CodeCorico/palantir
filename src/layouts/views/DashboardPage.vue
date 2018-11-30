<template>
  <div class="dashboard-page">

    <!-- <div class="dashboard-background" :style="{ 'background-image': `url(${todayPicture})` }"></div> -->

    <div
      v-for="group in groups"
      :key="group.id"
      class="pr-group"
    >
      <div class="pr-group-title">
        <h2>{{ group.title }}</h2>
      </div>

      <a
        v-for="pr in group.prs"
        :key="pr.id"
        :href="pr.url"
        target="_blank"
        class="pr"
        :class="[pr.type]"
        :style="{
          'animation-delay': `${pr.animationDelay}ms`,
          'animation-duration': `${pr.animationDuration}ms`,
        }"
      >
        <a
          v-for="reviewer in pr.reviewers"
          :key="reviewer.id"
          :href="reviewer.url"
          target="_blank"
          class="pr-reviewer"
          :class="[`r-${reviewer.spaceIndex}`]"
        >
          <div class="pr-reviewer-container">
            <div class="pr-reviewer-align">
              <div class="pr-reviewer-content">
                <img class="pr-reviewer-img" :src="reviewer.img" />
              </div>
            </div>
          </div>
        </a>

        <h3><span>{{ pr.scope }}</span></h3>
        <div class="pr-content">
          <div class="pr-background" :style="{ 'background-image': `url(${pr.authorImg})` }"></div>

          <div
            v-if="pr.state === 'dirty' || pr.state === 'unstable'"
            class="pr-state"
            :class="[`state-${pr.state}`]"
          >
            <i v-if="pr.state === 'dirty'" class="fas fa-times"></i>
            <i v-if="pr.state === 'unstable'" class="fas fa-skull-crossbones"></i>
          </div>

          <ui-pr-chart :values="pr.lines"></ui-pr-chart>

          <div class="pr-number">#{{ pr.number }}</div>
        </div>
      </a>

      <div class="prs-clear"></div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiPrChart from '@/ui/views/PrChart.vue';

// import axios from 'axios';

// const BING_URL = 'https://bing.com';
// const BING_SERVICE = 'https://cors.io?https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US';

// mounted() {
//   try {
//     const bingData = await axios.get(BING_SERVICE);
//     this.$set(this, 'todayPicture', `${BING_URL}${bingData.data.images[0].url}`);
//   } catch (err) { }
// },
// data() {
//   return {
//     todayPicture: '',
//   };
// },

export default {
  name: 'dashboard-page',
  store,
  components: {
    UiPrChart,
  },
  computed: {
    ...mapState('Prs', ['groups']),
  },
  mounted() {
    this.loadGroups();
  },
  destroyed() {
    clearTimeout(this.loadGroupsTimeout);
  },
  methods: {
    loadGroups() {
      clearTimeout(this.loadGroupsTimeout);

      this.$store.dispatch('Prs/loadGroups');

      this.loadGroupsTimeout = setTimeout(() => this.loadGroups(), 4 * 60 * 1000); // 4min
    },
  },
  data() {
    return {
      loadGroupsTimeout: null,
    };
  },
};
</script>

<style lang="scss" scoped>
$prReviewerAnimationCount: 10;

@keyframes dashboard-pr-alert {
  from { transform: scale(1); }
  50% { transform: scale(2); }
  to { transform: scale(1); }
}

@keyframes pr-updown {
  from { transform: translateY(0); }
  to { transform: translateY(10px); }
}

@keyframes pr-state-animation {
  from { opacity: 0.9; }
  50% { opacity: 0.4; }
  to { opacity: 0.9; }
}

@for $i from 0 through $prReviewerAnimationCount {
  $rotate: round($i * 360 / $prReviewerAnimationCount);

  @keyframes dashboard-pr-reviewer-#{$i} {
    from { transform: rotate(0deg + $rotate); }
    to { transform: rotate(360deg + $rotate); }
  }

  @keyframes dashboard-pr-reviewer-stable-#{$i} {
    from { transform: rotate(315deg - $rotate); }
    to { transform: rotate(-45deg - $rotate); }
  }
}

.dashboard-page {
  position: relative;
  box-sizing: border-box;
  padding: 30px 50px;
  height: 100%;
  overflow: auto;

  .dashboard-background {
    position: absolute;
    top: 120px;
    left: 30px;
    right: 300px;
    height: 400px;
    background: black;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
  }

  .pr-group {
    position: relative;
    float: left;
    margin: 0 40px 40px 0;

    .pr-group-title {
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

    .prs-clear {
      clear: both;
    }
  }

  .pr, .pr:hover, .pr:visited, .pr:focus {
    color: white;
    text-decoration: none;
  }

  .pr {
    position: relative;
    display: block;
    float: left;
    width: 150px;
    height: 180px;
    margin: 0 25px 0 0;
    box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    animation: pr-updown 4s linear alternate infinite;

    &.warning h3 {
      background: linear-gradient(45deg, #fc9b00 0%,#ffb200 100%);
    }

    &.alert h3 {
      background: linear-gradient(45deg, #c93534 0%, #a71918 100%);

      span {
        animation: dashboard-pr-alert 1.5s linear infinite;
      }
    }

    .pr-state {
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 30px;

      i {
        animation: pr-state-animation 1.75s linear infinite;
      }

      &.state-dirty {
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

    .pr-content {
      position: relative;
      width: 150px;
      height: 150px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      overflow: hidden;

      .pr-background {
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

      .pr-number {
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

    .pr-reviewer, .pr-reviewer:hover, .pr-reviewer:visited, .pr-reviewer:focus {
      color: white;
      text-decoration: none;
    }

    .pr-reviewer {
      z-index: 1;
      user-select: none;
      display: block;
      position: absolute;
      top: -36px;
      left: -36px;
      width: 66px;
      height: 66px;
      transform-origin: 78px 125px;

      @for $i from 0 through $prReviewerAnimationCount {
        $sec: (10s + $i);

        &.r-#{$i} {
          animation: dashboard-pr-reviewer-#{$i} $sec linear infinite;

          .pr-reviewer-container {
            animation: dashboard-pr-reviewer-stable-#{$i} $sec linear infinite;
          }
        }
      }

      .pr-reviewer-container {
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

      .pr-reviewer-align {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(45deg);
        transform-origin: top left;
      }

      .pr-reviewer-content {
        position: absolute;
        top: -33px;
        left: -2px;
        width: 62px;
        height: 64px;
        background: #383838;
      }

      .pr-reviewer-img {
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

<template>
  <div class="dashboard-page">

    <!-- <div class="dashboard-background" :style="{ 'background-image': `url(${todayPicture})` }">

          v-if="pr.reviewersActive > reviewerIndex"
    </div> -->

    <div
      v-for="(group, froupIndex) in groups"
      :key="froupIndex"
      class="pr-group"
    >
      <div class="pr-group-title">
        <h2>{{ group.title }}</h2>
      </div>

      <div
        v-for="pr in group.prs"
        :key="pr.id"
        class="pr"
        :class="[pr.type]"
        :style="{
          'animation-delay': `${Math.round(Math.random() * 2000)}ms`,
          'animation-duration': `${Math.floor(Math.random() * (5001 - 2000)) + 2000}ms`,
        }"
      >
        <div
          v-for="(reviewer, reviewerIndex) in pr.reviewers"
          :key="reviewerIndex"
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
        </div>

        <h3><span>{{ pr.scope }}</span></h3>
        <div class="pr-content">
          <div class="pr-background" :style="{ 'background-image': `url(${pr.authorImg})` }"></div>
          <ui-pr-chart :values="pr.lines"></ui-pr-chart>
          <div class="pr-id">#{{ pr.id }}</div>
        </div>
      </div>

      <div class="prs-clear"></div>
    </div>

  </div>
</template>

<script>
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
  components: {
    UiPrChart,
  },
  data() {
    return {
      groups: [{
        title: 'Feat/288870 Hello World',
        prs: [{
          id: 56,
          scope: 'ecommerce-spa',
          type: 'warning',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [6540, 3250],
        }, {
          id: 57,
          scope: 'core-standalonebla bla',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [10, 200],
          reviewers: [{
            spaceIndex: 3,
            name: 'Xavier Boubert',
            img: 'https://fr.gravatar.com/userimage/3980406/e12053307af826cf95856d2a82fb992b.jpeg',
          }, {
            spaceIndex: 7,
            name: 'Xavier Boubert',
            img: 'https://fr.gravatar.com/userimage/3980406/e12053307af826cf95856d2a82fb992b.jpeg',
          }],
        }, {
          id: 692,
          scope: 'core-spa',
          type: 'alert',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [50, 150],
          reviewers: [{
            spaceIndex: 1,
            name: 'Xavier Boubert',
            img: 'https://fr.gravatar.com/userimage/3980406/e12053307af826cf95856d2a82fb992b.jpeg',
          }],
        }],
      }, {
        title: 'Feat/288870 Hello World',
        prs: [{
          id: 56,
          scope: 'core-spa',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [6540, 3250],
        }],
      }, {
        title: 'Feat/288870 Hello World',
        prs: [{
          id: 56,
          scope: 'core-spa',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [6540, 3250],
        }, {
          id: 57,
          scope: 'core-spa',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [10, 200],
          reviewers: [{
            spaceIndex: 3,
            name: 'Xavier Boubert',
            img: 'https://fr.gravatar.com/userimage/3980406/e12053307af826cf95856d2a82fb992b.jpeg',
          }, {
            spaceIndex: 7,
            name: 'Xavier Boubert',
            img: 'https://fr.gravatar.com/userimage/3980406/e12053307af826cf95856d2a82fb992b.jpeg',
          }],
        }, {
          id: 692,
          scope: 'core-spa',
          type: 'alert',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [50, 150],
          reviewers: [{
            spaceIndex: 1,
            name: 'Xavier Boubert',
            img: 'https://fr.gravatar.com/userimage/3980406/e12053307af826cf95856d2a82fb992b.jpeg',
          }],
        }],
      }, {
        title: 'Feat/288870 Hello World',
        prs: [{
          id: 56,
          scope: 'core-spa',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [6540, 3250],
        }],
      }, {
        title: 'Feat/288870 Hello World',
        prs: [{
          id: 56,
          scope: 'core-spa',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [6540, 3250],
        }],
      }, {
        title: 'Feat/288870 Hello World',
        prs: [{
          id: 56,
          scope: 'core-spa',
          authorImg: 'https://secure.gravatar.com/avatar/9e38451efa23937301594f273033c5f1?s=150',
          lines: [6540, 3250],
        }],
      }],
    };
  },
};
</script>

<style lang="scss" scoped>
$prReviewerAnimationCount: 10;

@keyframes dashboard-pr-alert {
  from { transform: scale(1); }
  50% { transform: scale(1.5); }
  to { transform: scale(1); }
}

@keyframes pr-updown {
  from { transform: translateY(0); }
  to { transform: translateY(10px); }
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
    margin: 0 50px 50px 0;

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
      color: rgba(255, 255, 255, 0.1);
      font-size: 28px;
      font-weight: bold;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
    }

    .prs-clear {
      clear: both;
    }
  }

  .pr {
    position: relative;
    float: left;
    width: 150px;
    height: 180px;
    margin: 0 30px 0 0;
    box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    animation: pr-updown 4s linear alternate infinite;
    // overflow: hidden;

    &.warning h3 {
      background: linear-gradient(45deg, rgba(252,155,0,1) 0%,rgba(255,178,0,1) 100%);
    }

    &.alert h3 {
      background: linear-gradient(45deg, rgba(255,107,153,1) 0%,rgba(255,131,112,1) 100%);

      span {
        animation: dashboard-pr-alert 1.5s linear infinite;
      }
    }

    h3 {
      box-sizing: border-box;
      height: 30px;
      margin: 0;
      padding: 4px 0 0;
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
        opacity: 0.3;
      }

      .pr-id {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        color: white;
        font-weight: 300;
        font-size: 24px;
      }
    }

    .pr-reviewer {
      z-index: 1;
      user-select: none;
      position: absolute;
      top: -36px;
      left: -36px;
      width: 66px;
      height: 66px;
      transform-origin: 78px 125px;

      @for $i from 0 through $prReviewerAnimationCount {
        &.r-#{$i} {
          animation: dashboard-pr-reviewer-#{$i} 15s linear infinite;

          .pr-reviewer-container {
            animation: dashboard-pr-reviewer-stable-#{$i} 15s linear infinite;
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

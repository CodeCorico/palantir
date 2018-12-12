<template>
  <div class="app-timeline">
    <div class="minimap"></div>

    <ui-scrolls
      ref="scrolls"
      class="map-container"
      :fixed="true"
      :is-over="inScrolls"
      :v-offset-top="160"
      @scroll="mapScrolling"
    >
      <div class="map" :style="`height: ${mapHeight}px`">
        <div class="map-column">
          <div class="event idle">5</div>
          <div class="event success">5</div>
          <div class="event warning">add type to importComponent &amp; remove bad async</div>
          <div class="event success-warning"><span>5</span><span>7</span></div>
          <div class="event idle-warning"><span>2</span><span>7</span></div>
          <div class="event idle-success"><span>2</span><span>7</span></div>
          <div class="event idle-success-warning"><span>2</span><span>3</span><span>7</span></div>

          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
        <div class="map-column">
          <div class="event idle">5</div>
          <div class="event warning">add type to importComponent &amp; remove bad async</div>
          <div class="event success">5</div>
          <div class="event-link" style="width: 40px; margin-left: -35px;"></div>
          <div class="event success-warning"><span>5</span><span>7</span></div>
          <div class="event idle-success" :style="`margin-top: ${16+2+2+5+5+5 +5}px;`"><span>2</span><span>7</span></div>
          <div class="event idle-warning"><span>2</span><span>7</span></div>
          <div class="event idle-success-warning"><span>2</span><span>3</span><span>7</span></div>
        </div>
        <div class="map-column">
          <div class="event idle">5</div>
          <div class="event warning">add type to importComponent &amp; remove bad async</div>
          <div class="event success">5</div>
          <div class="event-link" style="width: 40px; margin-left: -35px;"></div>
          <div class="event success-warning"><span>5</span><span>7</span></div>
          <div class="event idle-success"><span>2</span><span>7</span></div>
          <div class="event-link" :style="`width: ${40+40+92}px; margin-left: -${40+40+92-5}px;`"></div>
          <div class="event idle-warning"><span>2</span><span>7</span></div>
          <div class="event idle-success-warning"><span>2</span><span>3</span><span>7</span></div>
        </div>
        <div class="map-column" style="min-width: 2000px">Hello</div>
      </div>
    </ui-scrolls>

    <div
      class="domains"
      :class="{ capitalize: capitalizeDomains }" @wheel="propagateWheel"
      @mouseenter="inScrolls = true"
      @mouseleave="inScrolls = false"
    >
      <div class="domains-titles">
        <input type="text" class="input-versions" :placeholder="datesTitle" />
        <input type="text" class="input-filter" :placeholder="filterText" />
      </div>

      <div class="domains-content" :style="`top: ${-mapScrollTop}px`">
        <div class="domain">router</div>
        <div class="domain">
          dom
          <div class="domain">current-script-polyfill</div>
        </div>
        <div class="domain">imports</div>
        <div class="domain">env</div>
      </div>
    </div>

    <div
      ref="dates"
      class="dates-container"
      @wheel="propagateWheel"
      @mouseenter="inScrolls = true"
      @mouseleave="inScrolls = false"
    >
      <div class="dates" :style="`left: ${-mapScrollLeft}px`">
        <div class="map-column">
          <div class="date-title">
            1.1.1
            <span>2018-12-12</span>
          </div>
        </div>
        <div class="map-column">
          <div class="date-title">
            1.1.0
            <span>2018-12-06</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content"></div>
  </div>
</template>

<script>
import store from '@/services/store';
import UiScrolls from '@/ui/views/Scrolls.vue';

export default {
  name: 'app-timeline',
  store,
  components: {
    UiScrolls,
  },
  props: {
    config: Object,
  },
  mounted() {
    window.addEventListener('resize', this.onWindowResize);

    this.onWindowResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize);
  },
  data() {
    return {
      mapScrollTop: 0,
      mapScrollLeft: 0,
      mapHeight: 0,
      inScrolls: false,

      capitalizeDomains: true,
      datesTitle: 'Versions',
      filterText: 'Filter...',
    };
  },
  methods: {
    onWindowResize() {
      this.refresh();
    },
    refresh() {
      this.$set(
        this,
        'mapHeight',
        this.$refs.scrolls.$el.clientHeight - this.$refs.dates.clientHeight,
      );

      this.$nextTick(() => this.$refs.scrolls.refresh());
    },
    mapScrolling(event, position) {
      this.$set(this, 'mapScrollTop', position.y);
      this.$set(this, 'mapScrollLeft', position.x);
    },
    propagateWheel(event) {
      this.$refs.scrolls.propagateWheel(event);
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.app-timeline {
  position: relative;
  height: 100%;

  .minimap {
    height: 100px;
    background: rgba(0, 0, 0, 0.4);
  }

  .map-container {
    position: absolute;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .domains {
    z-index: 1;
    position: absolute;
    box-sizing: border-box;
    left: 0;
    top: 100px;
    bottom: 0;
    width: 250px;
    overflow: hidden;
    background: $colorBg;
    border-right: 1px solid rgba(255, 255, 255, 0.1);

    &.capitalize {
      text-transform: capitalize;
    }

    .domains-titles {
      z-index: 1;
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: 0;
      height: 85px;
      padding: 10px 10px 0;
      background: $colorBg;
      overflow: hidden;

      input {
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 10px;
        border: 0;
        padding: 5px;
        outline: none;
        color: #fff;
      }

      .input-versions {
        background: rgba(0, 0, 0, 0.2);
      }

      .input-filter {
        background: rgba(0, 0, 0, 0.5);
      }
    }

    .domains-content {
      position: absolute;
      box-sizing: border-box;
      left: 0;
      min-height: 100%;
      width: 250px;
      margin-top: 80px;

      .domain {
        font-size: 12px;
        margin-bottom: 20px;
        padding: 0 20px;

        &:first-child {
          margin-top: 20px;
        }
      }
    }
  }

  .dates-container {
    z-index: 1;
    position: absolute;
    left: 250px;
    top: 100px;
    right: 0;
    height: 80px;
    background: $colorBg;
    overflow: hidden;

    .dates {
      position: absolute;
      box-sizing: border-box;
      top: 0;
      min-width: 100%;
      height: 80px;
      padding-left: 10px;

      .map-column {
        padding-top: 0;
        height: 80px;

        &::after {
          content: '';
          z-index: -1;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          background: #fff;
          border-radius: 50%;
          border: 5px solid $colorBg;
        }
      }

      .date-title {
        padding: 10px 0 5px;
        text-align: center;
        font-weight: 600;
        background: $colorBg;

        span {
          display: block;
          opacity: 0.6;
          font-size: 12px;
          margin-top: 5px;
        }
      }
    }
  }

  .map {
    display: table;
    padding: 80px 0 0 260px;
  }

  .map-column {
    position: relative;
    display: table-cell;
    box-sizing: border-box;
    min-width: 132px;
    max-width: 132px;
    width: 132px;
    vertical-align: top;
    padding: 10px 15px;

    &::before {
      content: '';
      z-index: -1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      background: rgba(255, 255, 255, 0.4);
    }
  }

  .event {
    user-select: none;
    cursor: pointer;
    height: 16px;
    width: 72px;
    margin-bottom: 5px;
    padding: 2px 10px;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border-radius: 16px;
    text-align: center;
    line-height: 16px;
    border: 5px solid $colorBg;

    &:first-child {
      margin-top: 3px;
    }

    &.idle {
      background: linear-gradient(to bottom, #6998fc 0%,#6089e6 100%);
    }

    &.success {
      background: linear-gradient(to bottom, #4cbaab 0%, #389393 100%)
    }

    &.warning {
      background: linear-gradient(to bottom, #f39d4c 0%, #e48a41 100%)
    }

    &.error {
      background: linear-gradient(to bottom, #f672a2 0%, #ec5f92 100%)
    }

    &.success-warning, &.idle-success, &.idle-warning {
      span {
        float: left;
        width: (72px / 2) - 10px;
        text-align: center;

        &:last-child {
          float: right;
        }
      }
    }

    &.idle-success-warning {
      span {
        width: (72px / 3);
        text-align: center;

        &:first-child {
          float: left;
          width: (72px / 3) - 10px;
        }

        &:last-child {
          float: right;
          width: (72px / 3) - 10px;
        }
      }
    }

    &.success-warning {
      background: linear-gradient(135deg, #4cbaab 0%,#389393 49%,#f39d4c 51%,#e48a41 100%);
    }

    &.idle-success {
      background: linear-gradient(135deg, #6998fc 0%,#6089e6 49%,#4cbaab 51%,#389393 100%);
    }

    &.idle-warning {
      background: linear-gradient(135deg, #6998fc 0%,#6089e6 49%,#f39d4c 51%,#e48a41 100%);
    }

    &.idle-success-warning {
      background: linear-gradient(to right, #6998fc 0%,#6089e6 32%,#4cbaab 33%,#389393 65%,#f39d4c 66%,#e48a41 100%);
    }
  }

  .event-link {
    height: 3px;
    margin-top: -21px;
    margin-bottom: 18px;
    background: linear-gradient(to right, transparent 50%, #223049 50%), linear-gradient(to right, #f39d4c, #4cbaab);
    background-size: 5px 3px, 100% 3px;
  }
}
</style>

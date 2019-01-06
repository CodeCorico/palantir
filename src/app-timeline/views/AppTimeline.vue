<template>
  <div class="app-timeline">
    <timeline-minimap
      class="minimap"
      :datesEvents="datesEvents"
      :domains="domains"
      :visible-area-width="visibleAreaWidth"
      :visible-area-height="visibleAreaHeight"
      :scroll-y="scrollY"
      :scroll-x="scrollX"
    ></timeline-minimap>

    <ui-scrolls
      ref="scrolls"
      class="map-container"
      content-display="table"
      :fixed="true"
      :is-over="inScrolls"
      :v-offset-top="160"
      @scroll="mapScrolling"
    >
      <div ref="map" class="map" :style="`height: ${mapHeightFixed}px`">
        <div
          v-for="datesEvent in datesEvents"
          :key="datesEvent.title"
          class="map-column"
          :class="{ selected: datesEvent.title === dateSelected }"
          @click="selectColumn(datesEvent.title)"
        >
          <template v-for="event in datesEvent.events">
            <div
              :key="event.domain"
              class="event"
              :class="event.type"
              :style="eventStyle(datesEvent.events, event)"
              :title="event.isSingle ? event.texts[0] : ''"
            >
              <span v-for="(text, textIndex) in event.texts" :key="textIndex">{{ text }}</span>
            </div>

            <div
              :key="`${event.domain}-link`"
              v-if="event.lastWarning > -1"
              class="event-link"
              :class="`warning-${event.warningOnly ? 'warning' : 'success'}`"
              :style="eventLinkStyle(event.dateIndex, event.lastWarning)"
            ></div>
          </template>
        </div>
      </div>
    </ui-scrolls>

    <div
      class="domains"
      :class="{ capitalize: config.capitalizeDomains }"
      @wheel="propagateWheel"
      @mouseenter="inScrolls = true"
      @mouseleave="inScrolls = false"
    >
      <div class="domains-titles">
        <input
          type="text"
          class="input-versions"
          v-model="dateFilter"
          :placeholder="config.datesTitle || 'Dates...'"
        />
        <input
          type="text"
          class="input-filter"
          v-model="domainFilter"
          :placeholder="config.filterText || 'Filter...'"
        />
      </div>

      <div class="domains-content" :style="`top: ${-mapScrollTop}px`">
        <div
          v-for="domain in domains"
          :key="domain"
          class="domain"
        >{{ domain }}</div>
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
        <div
          v-for="date in datesColumns"
          :key="date.title"
          class="map-column"
          :class="{ selected: date.title === dateSelected, 'is-idle': date.isIdle }"
          @click="selectColumn(date.title)"
        >
          <div class="date-title">
            {{ date.title }}
            <span v-if="date.subtitle">{{ date.subtitle }}</span>
          </div>
        </div>
      </div>
    </div>

    <transition name="content">
      <div class="content" v-if="content">
        <ui-scrolls class="content-scrolls">
          <div class="content-html" v-html="content"></div>
        </ui-scrolls>
        <div class="content-cross" @click="unselectColumns"><i class="fas fa-times"></i></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiScrolls from '@/ui/views/Scrolls.vue';
import TimelineMinimap from './TimelineMinimap.vue';

export default {
  name: 'app-timeline',
  store,
  components: {
    UiScrolls,
    TimelineMinimap,
  },
  props: {
    config: Object,
  },
  created () {
    this.$on('scrollToY', this.onScrollToY);
    this.$on('scrollToX', this.onScrollToX);
  },
  mounted() {
    window.addEventListener('resize', this.onWindowResize);

    this.$store.dispatch('Timeline/load', this.config.url);
  },
  destroyed() {
    clearTimeout(this.filterDateTimeout);
    clearTimeout(this.filterDomainTimeout);
    window.removeEventListener('resize', this.onWindowResize);
  },
  watch: {
    config() {
      this.$store.dispatch('Timeline/load', this.config.url);
    },
  },
  data() {
    return {
      mapScrollTop: 0,
      mapScrollLeft: 0,
      mapWidth: 0,
      mapHeight: 0,
      mapHeightFixed: 0,
      inScrolls: false,
      visibleAreaWidth: 0,
      visibleAreaHeight: 0,
      scrollY: 0,
      scrollX: 0,
      filterDateTimeout: null,
      filterDomainTimeout: null,
      dateSelected: '',
      content: '',
    };
  },
  computed: {
    ...mapState('Timeline', [
      'lastWarnings',
      'domains',
      'datesColumns',
    ]),
    datesEvents() {
      this.$nextTick(() => this.onWindowResize());

      this.unselectColumns();

      return this.$store.state.Timeline.datesEvents;
    },
    dateFilter: {
      get() {
        return this.$store.state.Timeline.dateFilter;
      },
      set(value) {
        clearTimeout(this.filterDateTimeout);

        this.filterDateTimeout = setTimeout(() => {
          this.$store.dispatch('Timeline/filter', { type: 'date', value });
        }, 250);
      }
    },
    domainFilter: {
      get() {
        return this.$store.state.Timeline.domainFilter;
      },
      set(value) {
        clearTimeout(this.filterDomainTimeout);

        this.filterDomainTimeout = setTimeout(() => {
          this.$store.dispatch('Timeline/filter', { type: 'domain', value });
        }, 250);
      }
    }
  },
  methods: {
    selectColumn(dateTitle) {
      if (this.dateSelected === dateTitle) {
        this.unselectColumns();

        return;
      }

      this.$set(this, 'dateSelected', dateTitle);

      for (let i = 0; i < this.datesEvents.length; i++) {
        if (this.datesEvents[i].title === dateTitle) {
          this.$set(this, 'content', this.datesEvents[i].content || 'No content.');

          break;
        }
      }
    },
    unselectColumns() {
      this.$set(this, 'dateSelected', '');
      this.$set(this, 'content', '');
    },
    onScrollToY(value) {
      this.$refs.scrolls.scrollToY(value);
    },
    onScrollToX(value) {
      this.$refs.scrolls.scrollToX(value);
    },
    onWindowResize() {
      this.refresh();
    },
    containersSizes() {
      const styleW = window.getComputedStyle(this.$refs.map, null).getPropertyValue('width');
      const styleH = window.getComputedStyle(this.$refs.map, null).getPropertyValue('height');
      const realWidth = Math.round(parseInt(styleW, 10));
      const realHeight = Math.round(parseInt(styleH, 10));
      const paddingWidth = this.$refs.map.clientWidth - realWidth;
      const paddingHeight = this.$refs.map.clientHeight - realHeight;

      return { realWidth, realHeight, paddingWidth, paddingHeight };
    },
    areaVisible() {
      const { paddingWidth, paddingHeight }= this.containersSizes();

      return {
        areaVisibleWidth: this.$refs.scrolls.$el.clientWidth - paddingWidth,
        areaVisibleHeight: this.$refs.scrolls.$el.clientHeight - paddingHeight,
      };
    },
    refresh() {
      const mapHeightFixed = this.$refs.scrolls.$el.clientHeight - this.$refs.dates.clientHeight;

      this.$set(this, 'mapHeightFixed', mapHeightFixed);

      this.$nextTick(() => {
        const { realWidth, realHeight } = this.containersSizes();

        this.$set(this, 'mapWidth', realWidth);
        this.$set(this, 'mapHeight', realHeight);

        this.$refs.scrolls.refresh();

        const { areaVisibleWidth, areaVisibleHeight } = this.areaVisible();

        this.$set(this, 'visibleAreaWidth', areaVisibleWidth * 100 / realWidth);
        this.$set(this, 'visibleAreaHeight', areaVisibleHeight * 100 / realHeight);
      });
    },
    mapScrolling(event, position) {
      this.$set(this, 'mapScrollTop', position.y);
      this.$set(this, 'mapScrollLeft', position.x);

      const { realWidth, realHeight } = this.containersSizes();
      const { areaVisibleWidth, areaVisibleHeight } = this.areaVisible();

      this.$set(this, 'scrollX', Math.round(position.x * 100 / (realWidth - areaVisibleWidth)));
      this.$set(this, 'scrollY', Math.round(position.y * 100 / (realHeight - areaVisibleHeight)));
    },
    propagateWheel(event) {
      this.$refs.scrolls.propagateWheel(event);
    },
    eventStyle(events, event) {
      const index = events.indexOf(event);
      const prevIndex = index - 1;
      const domainsIndex = this.domains.indexOf(event.domain);
      const domainsPrevIndex = prevIndex < 0 ? -1 : this.domains.indexOf(events[prevIndex].domain);
      let spaceEvents = domainsIndex - domainsPrevIndex - 1;

      if (spaceEvents < 1) {
        return {};
      }

      const marginTop = 5;

      // height + padding-top + padding-bottom + border-top + border-bottom + margin-top
      const eventSize = 16 + 2 + 2 + 5 + 5 + marginTop;

      return {
        marginTop: `${(eventSize * (spaceEvents)) + marginTop}px`,
      };
    },
    eventLinkStyle(dateIndex, lastWarning) {
      const width = ((dateIndex - lastWarning - 1) * (40 + 92)) + 40;

      return {
        width: `${width}px`,
        marginLeft: `-${width - 5}px`,
      };
    },
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
        height: 15px;
        margin-bottom: 20px;
        padding: 0 20px;
        font-size: 12px;
        overflow: hidden;

        &:first-child {
          margin-top: 22px;
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

        &::before {
          top: 53px;
        }

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

        &.is-idle::after {
          background: #6998fc;
          border-color: #2b4466;
        }
      }

      .date-title {
        user-select: none;
        cursor: pointer;
        padding: 10px 0 5px;
        text-align: center;
        font-weight: 600;

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
    cursor: pointer;
    position: relative;
    display: table-cell;
    box-sizing: border-box;
    min-width: 132px;
    max-width: 132px;
    width: 132px;
    vertical-align: top;
    padding: 10px 15px;

    &.selected {
      background: rgba(0, 0, 0, 0.3);
    }

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
    margin-top: 5px;
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
      background: linear-gradient(to bottom, #4cbaab 0%, #389393 100%);
    }

    &.warning {
      background: linear-gradient(to bottom, #f39d4c 0%, #e48a41 100%);
    }

    &.error {
      background: linear-gradient(to bottom, #f672a2 0%, #ec5f92 100%);
    }

    &.perf {
      background: linear-gradient(to bottom, #904cba 0%, #683893 100%);
    }

    &.success-warning, &.success-perf, &.warning-perf,
    &.idle-success, &.idle-warning, &.idle-perf {
      span {
        float: left;
        width: (72px / 2) - 10px;
        text-align: center;

        &:last-child {
          float: right;
        }
      }
    }

    &.idle-success-warning, &.idle-success-perf, &.idle-warning-perf {
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

    &.idle-success-warning-perf {
      span {
        display: inline-block;
        width: 24px;
        text-align: center;

        &:first-child {
          float: left;
          width: (72px / 4) - 10px;
        }

        &:last-child {
          float: right;
          width: (72px / 4) - 10px;
        }
      }
    }

    &.success-warning {
      background: linear-gradient(135deg, #4cbaab 0%,#389393 49%,#f39d4c 51%,#e48a41 100%);
    }

    &.success-perf {
      background: linear-gradient(135deg, #4cbaab 0%,#389393 49%,#904cba 51%,#683893 100%);
    }

    &.warning-perf {
      background: linear-gradient(135deg, #f39d4c 0%,#e48a41 49%,#904cba 51%,#683893 100%);
    }

    &.idle-success {
      background: linear-gradient(135deg, #6998fc 0%,#6089e6 49%,#4cbaab 51%,#389393 100%);
    }

    &.idle-warning {
      background: linear-gradient(135deg, #6998fc 0%,#6089e6 49%,#f39d4c 51%,#e48a41 100%);
    }

    &.idle-perf {
      background: linear-gradient(135deg, #6998fc 0%,#6089e6 49%,#904cba 51%,#683893 100%);
    }

    &.idle-success-warning {
      background: linear-gradient(to right, #6998fc 0%,#6089e6 32%,#4cbaab 33%,#389393 65%,#f39d4c 66%,#e48a41 100%);
    }

    &.idle-success-perf {
      background: linear-gradient(to right, #6998fc 0%,#6089e6 32%,#4cbaab 33%,#389393 65%,#904cba 66%,#683893 100%);
    }

    &.idle-warning-perf {
      background: linear-gradient(to right, #6998fc 0%,#6089e6 32%,#f39d4c 33%,#e48a41 65%,#904cba 66%,#683893 100%);
    }

    &.idle-success-warning-perf {
      background: linear-gradient(to right, #6998fc 0%,#6089e6 24%,#4cbaab 25%,#389393 49%,#f39d4c 50%,#e48a41 74%,#904cba 75%,#683893 100%);
    }
  }

  .event-link {
    user-select: none;
    height: 3px;
    margin-top: -3px;
    transform: translateY(-14px);

    &.warning-success {
      background: linear-gradient(to right, transparent 50%, #223049 50%), linear-gradient(to right, #f39d4c, #4cbaab);
      background-size: 5px 3px, 100% 3px;
    }

    &.warning-warning {
      background: linear-gradient(to right, transparent 50%, #223049 50%), linear-gradient(to right, #f39d4c, #e48a41);
      background-size: 5px 3px, 100% 3px;
    }
  }

  .content {
    z-index: 1;
    position: absolute;
    top: 100px;
    right: 40px;
    bottom: 0;
    width: 340px;

    &::before, &::after {
      z-index: -1;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: $colorBg;
      opacity: 0.9;
    }

    &::after {
      background: rgba(0, 0, 0, 0.4);
    }

    &.content-enter-active, &.content-leave-active {
      transition: all 0.25s $easeOutQuart;
    }

    &.content-enter {
      opacity: 0;
      transform: translateX(-50px);
    }

    &.content-enter-to {
      opacity: 0.9;
      transform: translateX(0);
    }

    &.content-leave {
      opacity: 0.9;
      transform: translateX(0);
    }

    &.content-leave-to {
      opacity: 0;
      transform: translateX(50px);
    }

    .content-scrolls {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .content-cross {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
      color: #fff;
      font-size: 20px;
    }

    .content-html {
      padding: 20px;
      color: #fff;
      font-size: 14px;

      /deep/ {
        a, a:hover, a:focus {
          color: #b0e0db;
          text-decoration: none;
        }

        h2 {
          font-weight: 300;
          font-size: 22px;
          margin: 0 0 30px;
        }

        h3 {
          display: inline-block;
          margin: 0 0 15px;
          font-weight: 600;
          font-size: 18px;
          padding: 2px 5px;

          &#breaking-changes {
            background: #6998fc;
          }

          &#features {
            background: #4cbaab;
          }

          &#bug-fixes {
            background: #f39d4c;
          }

          &#performance-improvements {
            background: #904cba;
          }
        }

        ul {
          margin: 0 0 30px 12px;
          padding: 0;
          font-weight: 300;

          li {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
}
</style>

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
      :class="{ capitalize: capitalizeDomains }" @wheel="propagateWheel"
      @mouseenter="inScrolls = true"
      @mouseleave="inScrolls = false"
    >
      <div class="domains-titles">
        <input type="text" v-model="dateFilter" class="input-versions" :placeholder="datesTitle" />
        <input type="text" v-model="domainFilter" class="input-filter" :placeholder="filterText" />
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
        >
          <div class="date-title">
            {{ date.title }}
            <span v-if="date.subtitle">{{ date.subtitle }}</span>
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

    this.onWindowResize();

    this.parseEvents();
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize);
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
      dateFilter: '',
      domainFilter: '',
      filterTimeout: null,

      capitalizeDomains: true,
      datesTitle: 'Versions...',
      filterText: 'Filter...',
      lastWarnings: {},
      domains: [],
      datesColumns: [],
      datesEvents: [],

      dates: [{
        title: '0.1.11',
        subtitle: '2018-11-27',
      }, {
        title: '0.1.10',
        subtitle: '2018-11-27',
      }, {
        title: '0.1.8',
        subtitle: '2018-11-26',
        events: {
          build: {
            warning: ['the "build:report" script start the analyser'],
          },
          vue: {
            warning: ['return an empty object when the $route is null'],
          },
        }
      }, {
        title: '0.1.7',
        subtitle: '2018-11-16',
        events: {
          router: {
            warning: ['add support for direct pages of subroutes'],
            success: ['add debug.router.routes displaying routes loaded'],
          },
        }
      }, {
        title: '0.1.6',
        subtitle: '2018-11-14',
        events: {
          '*': {
            warning: ['rename the global dist "core" to "coreSpa"'],
          },
          imports: {
            success: ['attach debug import components loaded'],
          },
        }
      }, {
        title: '0.1.5',
        subtitle: '2018-11-11',
      }, {
        title: '0.1.4',
        subtitle: '2018-11-11',
      }, {
        title: '0.1.3',
        subtitle: '2018-11-10',
        events: {
          env: {
            warning: ['use new system based on the window.ENV variable'],
          },
        },
      }, {
        title: '0.1.2',
        subtitle: '2018-11-08',
        events: {
          '*': {
            warning: ['some tests'],
          },
          bootstrap: {
            warning: ['publish core.version'],
          },
        },
      }, {
        title: '0.1.1',
        subtitle: '2018-11-08',
        events: {
          cypress: {
            idle: ['hello'],
            warning: ['remove cypress & standalone website serving'],
          },
          env: {
            idle: ['hello'],
            warning: ['replace the debug info reducer by a map'],
            success: ['create the env feature'],
          },
          imports: {
            warning: [
              'add type to importComponent & remove bad async',
              'call nextTick with arguments',
              'keep the module name from the file in extractNamespace()',
              'use main module with its dependencies',
              'use the debug feature for minified umd',
            ],
            success: [
              'add the UMD_MINIFIED config flag',
              'create the imports UMD feature',
              'resolve chunked components in importComponent',
              'support IE with current-script-polyfill',
            ],
          },
          build: {
            success: ['add better building stages'],
          },
          config: {
            success: ['add a config registration feature'],
          },
          debug: {
            success: ['create the debug feature'],
          },
          'dom current-script-polyfill': {
            success: ['create the polyfill feature'],
          },
        },
      }],
    };
  },
  watch: {
    dateFilter() {
      this.refreshFilters();
    },
    domainFilter() {
      this.refreshFilters();
    },
  },
  methods: {
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

      // height + padding-top + padding-bottom + border-top + border-bottom + margin-top
      const eventSize = 16 + 2 + 2 + 5 + 5 + 5;

      return {
        marginTop: `${eventSize * (spaceEvents)}px`,
      };
    },
    eventLinkStyle(dateIndex, lastWarning) {
      const width = ((dateIndex - lastWarning - 1) * (40 + 92)) + 40;

      return {
        width: `${width}px`,
        marginLeft: `-${width - 5}px`,
      };
    },
    refreshFilters() {
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(this.parseEvents, 200);
    },
    parseEvents() {
      const lastWarnings = {};
      const domains = [];
      const datesColumns = [];
      const datesEvents = [];

      let dateIndex = -1;

      // FAKE DATA
      // this.dates.forEach((date) => {
      //   // if (date.events) {
      //   //   Object.keys(date.events).forEach((key) => {
      //   //     date.events[`${key}2`] = date.events[key];
      //   //     date.events[`${key}3`] = date.events[key];
      //   //     date.events[`${key}4`] = date.events[key];
      //   //   })
      //   // }

      //   for (let i = 0; i < 10; i++) {
      //     const newDate = Object.assign({}, date);
      //     newDate.title = newDate.title.replace(/^0/, i + 1);
      //     this.dates.push(newDate);
      //   }
      // });
      // this.dates.sort((a, b) => {
      //   return a.title > b.title ? -1 : a.title < b.title ? 1 : 0;
      // });
      // END FAKE DATA

      this.dates.forEach((date) => {
        if (!date.title) {
          return;
        }

        if (this.dateFilter) {
          const reg = new RegExp(this.dateFilter.replace('.', '\\.').replace('*', '.*'), 'i');

          if (!date.title.match(reg)) {
            return;
          }
        }

        dateIndex++;

        datesColumns.push({
          title: date.title,
          subtitle: date.subtitle || null,
        });

        const events = [];

        if (!date.events) {
          datesEvents.push(events);

          return;
        }

        Object.keys(date.events).forEach((key) => {
          const domain = key.trim().toLowerCase();
          const event = date.events[key];

          if (this.domainFilter) {
            const reg = new RegExp(this.domainFilter.replace('.', '\\.').replace('*', '.*'), 'i');

            if (!domain.match(reg)) {
              return;
            }
          }

          if (domains.indexOf(domain) < 0) {
            domains.push(domain);
          }

          const eventKeys = Object.keys(event);
          const types = [];
          const texts = [];
          let isSingle = false;

          if (eventKeys.length === 1 && event[eventKeys[0]].length === 1) {
            isSingle = true;
            types.push(eventKeys[0]);
            texts.push(event[eventKeys[0]][0]);
          }
          else {
            ['idle', 'success', 'warning'].forEach((state) => {
              if (event[state]) {
                types.push(state);
                texts.push(event[state].length);
              }
            });
          }

          let lastWarning = -1;

          if (typeof lastWarnings[domain] !== 'undefined') {
            lastWarning = lastWarnings[domain];

            delete lastWarnings[domain];
          }

          events.push({
            dateIndex,
            domain,
            types,
            type: types.join('-'),
            texts,
            isSingle,
            lastWarning,
            warningOnly: types.indexOf('warning') > -1 && types.length === 1,
          });

          if (types.indexOf('warning') > -1) {
            lastWarnings[domain] = dateIndex;
          }
        });

        events.sort((a, b) => {
          return a.domain > b.domain
            ? 1
            : a.domain < b.domain ? -1 : 0;
        });

        datesEvents.push({ title: date.title, events });
      });

      domains.sort();

      this.$set(this, 'lastWarnings', lastWarnings);
      this.$set(this, 'domains', domains);
      this.$set(this, 'datesColumns', datesColumns);
      this.$set(this, 'datesEvents', datesEvents);
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
}
</style>

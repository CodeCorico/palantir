<template>
  <div class="ui-scrolls" :class="{ fixed, visible: barsAlwaysVisible || isOver }">
    <div
      ref="container"
      class="ui-scrolls-container"
      :style="`right: ${-scrollSize}px; bottom: ${-scrollSize}px;`"
      @scroll="onScroll"
    >
      <div ref="content" class="ui-scrolls-content">
        <slot></slot>
      </div>
    </div>

    <div class="ui-scrolls-vertical" v-if="barVSize < 100">
      <div ref="barAreaV" :style="`top: ${vOffsetTop}px; bottom: ${vOffsetBottom}px`">
        <div
          :style="`height: ${barVSize}%; top: ${barVOffset}%`"
          :class="{ active: barVActive }"
          @mousedown="onTickerMouseDown($event, 'v')"
        ></div>
      </div>
    </div>
    <div class="ui-scrolls-horizontal" v-if="barHSize < 100">
      <div ref="barAreaH" :style="`left: ${hOffsetLeft}px; right: ${hOffsetRight}px`">
        <div
          :style="`width: ${barHSize}%; left: ${barHOffset}%`"
          :class="{ active: barHActive }"
          @mousedown="onTickerMouseDown($event, 'h')"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ui-scrolls',
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
    isOver: {
      type: Boolean,
      default: false,
    },
    barsAlwaysVisible: {
      type: Boolean,
      default: false,
    },
    vOffsetTop: {
      type: Number,
      default: 0,
    },
    vOffsetBottom: {
      type: Number,
      default: 0,
    },
    hOffsetLeft: {
      type: Number,
      default: 0,
    },
    hOffsetRight: {
      type: Number,
      default: 0,
    },
  },
  created() {
    if (typeof window.scrollsSize === 'undefined') {
      const $tester = document.createElement('div');
      $tester.style.overflowY = 'auto';
      $tester.style.overflowX = 'hidden';
      $tester.style.visibility = 'hidden';
      $tester.style.height = '50px';
      $tester.style.width = '100px';

      $tester.innerHTML = '<div style="height: 200px; width: 100%"></div>';

      document.body.appendChild($tester);
      window.scrollsSize = Math.ceil(100 - $tester.children[0].clientWidth);
      document.body.removeChild($tester);
    }

    this.$set(this, 'scrollSize', window.scrollsSize);
  },
  mounted() {
    window.addEventListener('resize', this.onWindowResize);
    document.body.addEventListener('mousemove', this.onBodyMouseMove);
    document.body.addEventListener('mouseup', this.onBodyMouseUp);

    this.onWindowResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize);
    document.body.removeEventListener('mousemove', this.onBodyMouseMove);
    document.body.removeEventListener('mouseup', this.onBodyMouseUp);
  },
  data() {
    return {
      scrollSize: 0,
      barVSize: 0,
      barHSize: 0,
      barVOffset: 0,
      barHOffset: 0,
      dragging: null,
      barVActive: false,
      barHActive: false,
    };
  },
  methods: {
    onWindowResize() {
      this.refresh();
    },
    onScroll(event) {
      this.$emit('scroll', event, {
        y: event.target.scrollTop,
        x: event.target.scrollLeft,
      });

      this.refreshBarsPosition();
    },
    onTickerMouseDown(event, type) {
      this.$set(this, 'dragging', {
        type,
        offset: this.$refs.container[type === 'v' ? 'scrollTop' : 'scrollLeft'],
        cursorOffset: event[type === 'v' ? 'pageY' : 'pageX'],
      });

      this.$set(this, type === 'v' ? 'barVActive' : 'barHActive', true);
    },
    onBodyMouseMove(event) {
      if (!this.dragging) {
        return;
      }

      const { type, offset, cursorOffset } = this.dragging;
      const eventOffset = event[type === 'v' ? 'pageY' : 'pageX']
      const area = this.$refs.container[type === 'v' ? 'scrollHeight' : 'scrollWidth'];
      const bar = this.$refs[type === 'v' ? 'barAreaV' : 'barAreaH'];
      const max = bar[type === 'v' ? 'clientHeight' : 'clientWidth'];
      const scrollTo = offset + ((eventOffset - cursorOffset) * area / max);

      this.$refs.container[type === 'v' ? 'scrollTop' : 'scrollLeft'] = scrollTo;

      event.preventDefault();
      event.stopPropagation();
    },
    onBodyMouseUp() {
      this.$set(this, 'dragging', null);
      this.$set(this, 'barVActive', false);
      this.$set(this, 'barHActive', false);
    },
    propagateWheel(event) {
      if (!event || !event.deltaY) {
        return;
      }

      this.$refs.container.scrollTop += event.deltaY < 0 ? -100 : 100;
    },
    refresh() {
      this.$set(this, 'barVSize',
        Math.round(this.$refs.container.clientHeight * 100 / this.$refs.content.clientHeight),
      );
      this.$set(this, 'barHSize',
        Math.round(this.$refs.container.clientWidth * 100 / this.$refs.content.clientWidth),
      );

      this.refreshBarsPosition();
    },
    refreshBarsPosition() {
      this.$set(this, 'barVOffset',
        Math.round(this.$refs.container.scrollTop * 100 / this.$refs.container.scrollHeight),
      );
      this.$set(this, 'barHOffset',
        Math.round(this.$refs.container.scrollLeft * 100 / this.$refs.container.scrollWidth),
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-scrolls {
  position: relative;
  overflow: hidden;

  .ui-scrolls-container {
    position: absolute;
    top: 0;
    left: 0;
    overflow: scroll;
  }

  .ui-scrolls-content {
    display: table;
    min-height: 100%;
  }

  &.fixed {
    .ui-scrolls-vertical, .ui-scrolls-horizontal {
      z-index: 9;
      position: fixed;
    }
  }

  &:hover {
    .ui-scrolls-vertical, .ui-scrolls-horizontal {
      opacity: 1;
    }
  }


  &.visible {
    .ui-scrolls-vertical, .ui-scrolls-horizontal {
      opacity: 1;
    }
  }

  .ui-scrolls-vertical, .ui-scrolls-horizontal {
    user-select: none;
    position: absolute;
    opacity: 0;
    transition: opacity 0.35s $easeOutQuart;

    > div {
      position: absolute;

      > div {
        position: absolute;
        background: rgba(121, 121, 121, 0.4);

        &:hover {
          background: rgba(121, 121, 121, 0.6);
        }

        &.active {
          background: rgba(121, 121, 121, 0.8);
        }
      }
    }
  }

  .ui-scrolls-vertical {
    top: 0;
    right: 0;
    bottom: 0;
    width: 10px;

    > div {
      left: 0;
      right: 0;

      > div {
        left: 0;
        width: 100%;
      }
    }
  }

  .ui-scrolls-horizontal {
    bottom: 0;
    left: 0;
    right: 0;
    height: 10px;

    > div {
      top: 0;
      bottom: 0;

      > div {
        top: 0;
        height: 100%;
      }
    }
  }
}
</style>

<template>
  <div class="timeline-minimap">
    <canvas ref="minimap" class="minimap"></canvas>

    <div
      ref="selector"
      class="selector"
      :class="[dragging ? 'dragging' : '']"
      :style="`
        top: ${selectorY}px;
        left: ${selectorX}px;
        width: ${selectorWidth}px;
        height: ${selectorHeight}px;
      `"
      @mousedown="onSelectorMouseDown"
    ></div>
  </div>
</template>

<script>
import store from '@/services/store';

export default {
  name: 'timeline-minimap',
  store,
  props: {
    datesEvents: Array,
    domains: Array,
    visibleAreaWidth: Number,
    visibleAreaHeight: Number,
    scrollY: Number,
    scrollX: Number,
  },
  data() {
    return {
      minimapWidth: 0,
      minimapHeight: 0,
      selectorY: 0,
      selectorX: 0,
      selectorWidth: 100,
      selectorHeight: 35,
      dragging: null,
      eventsTypes: [
        ['success', 'warning'],
        ['success', 'perf'],
        ['warning', 'perf'],
        ['success', 'warning', 'perf'],
        ['idle', 'success'],
        ['idle', 'warning'],
        ['idle', 'perf'],
        ['idle', 'success', 'warning'],
        ['idle', 'success', 'warning', 'perf'],
      ],
      colors: {
        idle: '#6998fc',
        success: '#4cbaab',
        warning: '#f39d4c',
        error: '#f672a2',
        perf: '#904cba',
      },
    };
  },
  mounted() {
    window.addEventListener('resize', this.onWindowResize);
    document.body.addEventListener('mousemove', this.onBodyMouseMove);
    document.body.addEventListener('mouseup', this.onBodyMouseUp);

    this.init();
    this.onWindowResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize);
    document.body.removeEventListener('mousemove', this.onBodyMouseMove);
    document.body.removeEventListener('mouseup', this.onBodyMouseUp);
  },
  watch: {
    datesEvents() {
      this.refresh();
    },
    visibleAreaWidth() {
      if (!this.visibleAreaHeight) {
        return;
      }

      this.refreshSelector();
    },
    visibleAreaHeight() {
      if (!this.visibleAreaWidth) {
        return;
      }

      this.refreshSelector();
    },
    scrollY() {
      this.refreshSelectorPosition();
    },
    scrollX() {
      this.refreshSelectorPosition();
    },
  },
  methods: {
    onWindowResize() {
      this.refresh();
    },
    onSelectorMouseDown(event) {
      this.$set(this, 'dragging', {
        y: event.pageY,
        x: event.pageX,
        originSelectorY: this.selectorY,
        originSelectorX: this.selectorX,
      });

      event.preventDefault();
      event.stopPropagation();
    },
    onBodyMouseMove(event) {
      if (!this.dragging) {
        return;
      }

      const {
        x, y, originSelectorY, originSelectorX,
      } = this.dragging;
      const { pageY, pageX } = event;

      const newY = originSelectorY + (pageY - y);
      const newX = originSelectorX + (pageX - x);

      if (this.selectorHeight < this.minimapHeight) {
        const percentY = (newY * 100) / (this.minimapHeight - this.selectorHeight);

        this.$parent.$emit('scrollToY', Math.max(0, Math.min(100, percentY)));
      }
      if (this.selectorWidth < this.minimapWidth) {
        const percentX = (newX * 100) / (this.minimapWidth - this.selectorWidth);

        this.$parent.$emit('scrollToX', Math.max(0, Math.min(100, percentX)));
      }

      event.preventDefault();
      event.stopPropagation();
    },
    onBodyMouseUp() {
      this.$set(this, 'dragging', null);
    },
    init() {
      const context = this.$refs.minimap.getContext('2d');
      context.imageSmoothingEnabled = true;
    },
    refresh() {
      const lines = this.domains.length;
      const columns = this.datesEvents.length;
      const eventHeight = 20;
      const eventWidth = 92;
      const eventMargin = 20;
      const width = Math.ceil(((eventWidth + eventMargin) * columns) + eventMargin);
      const height = Math.ceil(
        ((eventHeight + eventMargin) * lines) + (eventHeight / 2) + eventMargin,
      );
      const scale = Math.min(this.$el.clientWidth / width, this.$el.clientHeight / height);

      this.$refs.minimap.width = this.$el.clientWidth;
      this.$refs.minimap.height = this.$el.clientHeight;

      this.$set(this, 'minimapWidth', width * scale);
      this.$set(this, 'minimapHeight', height * scale);

      const image = document.createElement('canvas');
      image.width = width;
      image.height = height;
      const imageContext = image.getContext('2d');
      imageContext.clearRect(0, 0, width, height);

      const eventsImages = {};

      this.eventsTypes.forEach((types) => {
        const widthWidthOffset = eventWidth + 2;
        const typesImage = document.createElement('canvas');
        typesImage.width = widthWidthOffset;
        typesImage.height = eventHeight;
        const typesImageContext = typesImage.getContext('2d');
        typesImageContext.clearRect(0, 0, widthWidthOffset, eventHeight);

        types.forEach((type, i) => {
          const left = i * (widthWidthOffset / types.length);
          const size = widthWidthOffset / types.length;

          typesImageContext.beginPath();
          typesImageContext.moveTo(left, eventHeight / 2);
          typesImageContext.lineTo(left + size, eventHeight / 2);
          typesImageContext.lineWidth = eventHeight;
          typesImageContext.strokeStyle = this.colors[type];
          typesImageContext.stroke();
        });

        typesImageContext.globalCompositeOperation = 'destination-in';
        typesImageContext.beginPath();
        typesImageContext.moveTo(12, eventHeight / 2);
        typesImageContext.lineTo(eventWidth - 9, eventHeight / 2);
        typesImageContext.lineWidth = eventHeight;
        typesImageContext.strokeStyle = '#ff0000';
        typesImageContext.lineCap = 'round';
        typesImageContext.stroke();

        eventsImages[types.join('-')] = typesImage;
      });

      for (let axisX = 0; axisX < columns; axisX += 1) {
        const dateEvents = this.datesEvents[axisX];

        if (dateEvents.events) {
          for (let axisY = 0; axisY < lines; axisY += 1) {
            const domain = this.domains[axisY];

            for (let eventI = 0; eventI < dateEvents.events.length; eventI += 1) {
              const event = dateEvents.events[eventI];

              if (event.domain === domain) {
                const x = ((eventWidth + eventMargin) * axisX) + eventMargin;
                const y = ((eventHeight + eventMargin) * axisY) + (eventHeight / 2) + eventMargin;

                if (event.types.length === 1) {
                  imageContext.beginPath();
                  imageContext.moveTo(x, y);
                  imageContext.lineTo(x + eventWidth - eventMargin, y);
                  imageContext.lineWidth = eventHeight;
                  imageContext.strokeStyle = this.colors[event.type];
                  imageContext.lineCap = 'round';
                  imageContext.stroke();
                } else {
                  imageContext.drawImage(eventsImages[event.type], x - 12, y - (eventHeight / 2));
                }

                break;
              }
            }
          }
        }
      }

      const context = this.$refs.minimap.getContext('2d');
      const canvasWidth = context.canvas.clientWidth;
      const canvasHeight = context.canvas.clientHeight;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(image, 0, 0, width, height, 0, 0, this.minimapWidth, this.minimapHeight);

      this.refreshSelector();
      this.refreshSelectorPosition();
    },
    refreshSelector() {
      const selectorWidth = Math.round((this.visibleAreaWidth * this.minimapWidth) / 100);
      const selectorHeight = Math.round((this.visibleAreaHeight * this.minimapHeight) / 100);

      this.$set(this, 'selectorWidth', Math.max(0, Math.min(this.minimapWidth, selectorWidth)));
      this.$set(this, 'selectorHeight', Math.max(0, Math.min(this.minimapHeight, selectorHeight)));
    },
    refreshSelectorPosition() {
      const selectorY = (this.scrollY * (this.minimapHeight - this.selectorHeight)) / 100;
      const selectorX = (this.scrollX * (this.minimapWidth - this.selectorWidth)) / 100;

      this.$set(this, 'selectorY', selectorY);
      this.$set(this, 'selectorX', selectorX);
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline-minimap {
  position: relative;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;

  .selector {
    // display: none;
    cursor: grab;
    box-sizing: border-box;
    position: absolute;
    border: 2px solid #baa0ff;
    opacity: 0.5;

    &:hover {
      opacity: 0.7;
    }

    &.dragging, &.dragging:hover {
      cursor: grabbing;
      opacity: 1;
    }
  }
}
</style>

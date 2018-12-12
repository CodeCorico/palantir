<template>
  <section
    class="app-images-randomizer"
    :class="[`appear-sb-${appearSb}`, `fixed-sb-${fixedSb}`]"
  >
    <div class="container">
      <h1>{{ title }}</h1>

      <div class="image-canvas">
        <div class="image-canvas-borders"></div>
      </div>

      <div v-if="legend" class="legend">{{ legend }}</div>

      <div v-if="image" class="image-fixed-anim"></div>
      <img v-if="image" class="image" :src="image" />
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';

export default {
  name: 'app-images-randomizer',
  store,
  destroyed() {
    this.clearAnim();
    this.clearRandomizeImages();
  },
  computed: {
    ...mapState('ImagesRandomizer', [
      'started', 'icon', 'title', 'selectedText', 'images', 'fixedTime'
    ]),
  },
  data() {
    return {
      appearSb: -1,
      fixedSb: -1,
      image: null,
      legend: '',
      dateTimeTimeout: null,
      animTimeout: null,
      randomizeImagesTimeout: null,
      endTimeout: null,
    };
  },
  watch: {
    started(value) {
      this[value ? 'start' : 'stop']();
    }
  },
  methods: {
    anim(sb, steps, step, done) {
      this.clearAnim();

      if (step >= steps.length) {
        if (done) {
          done();
        }

        return;
      }

      this.animTimeout = setTimeout(() => {
        this.$set(this, sb, step);

        this.anim(sb, steps, ++step, done);
      }, steps[step]);
    },
    start() {
      this.anim('appearSb', [0, 350, 350], 0, () => setTimeout(this.startRandomizeImages, 350));
    },
    stop() {
      this.clearAnim();
      this.clearRandomizeImages();

      this.$set(this, 'appearSb', -1);
      this.$set(this, 'fixedSb', -1);
      this.$set(this, 'image', null);
      this.$set(this, 'legend', '');

      this.$store.dispatch('ImagesRandomizer/stop');
    },
    startRandomizeImages() {
      const minLoops = this.images.length * 4;
      const maxLoops = this.images.length * 5;
      const loops = Math.floor(Math.random() * (maxLoops - minLoops + 1) + minLoops) - 1;

      this.randomizeImages(0, loops);
    },
    randomizeImages(index, loops) {
      this.clearRandomizeImages();

      this.$set(this, 'image', this.images[index].src);

      if (loops < 1) {
        this.randomizeImagesTimeout = setTimeout(() => {
          const legend = (typeof this.selectedText === 'string'
            ? this.selectedText
            : this.selectedText[Math.floor(Math.random() * this.selectedText.length)])
            .replace(/%s/g, this.images[index].legend);

          this.$set(this, 'legend', legend);

          this.randomizeImagesTimeout = setTimeout(() => this.goFixed(), 5000);
        }, 500);

        return;
      }

      this.randomizeImagesTimeout = setTimeout(() => {
        this.clearRandomizeImages();

        this.$set(this, 'image', null);

        index = index + 1 === this.images.length ? 0 : index + 1;

        this.randomizeImagesTimeout = setTimeout(() => this.randomizeImages(index, --loops));
      }, 200);
    },
    goFixed() {
      this.clearRandomizeImages();

      this.anim('fixedSb', [0, 350], 0, () => this.end((this.fixedTime || 60) * 1000));
    },
    end(time) {
      this.clearAnim();

      this.endTimeout = setTimeout(() => {
        this.$set(this, 'fixedSb', this.fixedSb + 1);

        this.endTimeout = setTimeout(() => this.stop(), 350);
      }, time);
    },
    clearAnim() {
      clearTimeout(this.animTimeout);
    },
    clearRandomizeImages() {
      clearTimeout(this.randomizeImagesTimeout);
    },
    clearEnd() {
      clearTimeout(this.endTimeout);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

@keyframes image-show {
  from { opacity: 0.3; transform: scale(0) translateY(-50%) translateX(-50%); }
  to { opacity: 1; transform: scale(1) translateY(-50%) translateX(-50%); }
}

@keyframes legend-show {
  from { opacity: 0; transform: translateY(0) translateX(-50%); }
  to { opacity: 1; transform: translateY(60px) translateX(-50%); }
}

@keyframes image-fixed-anim-notif {
  0% { opacity: 0; width: 118px; height: 118px; transform: translateY(1px) translateX(1px); }
  90% { opacity: 1; width: 118px; height: 118px; transform: translateY(1px) translateX(1px); }
  95% { opacity: 0; width: 170px; height: 170px; transform: translateY(-25px) translateX(-25px); }
  95.01% { opacity: 1; width: 118px; height: 118px; transform: translateY(1px) translateX(1px); }
  100% { opacity: 0; width: 170px; height: 170px; transform: translateY(-25px) translateX(-25px); }
}

.app-images-randomizer {
  z-index: 10000;
  user-select: none;
  display: none;
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;

  &, .container, h1, .image-canvas, .legend, .image {
    transition: all 0.35s $easeOutQuart;
  }

  &.appear-sb-0, &.appear-sb-1, &.appear-sb-2 {
    display: block;
  }

  &.appear-sb-1, &.appear-sb-2 {
    background: rgba($colorBg, 0.9);

    h1 {
      opacity: 1;
      transform: translateY(0) translateX(-50%);
    }
  }

  &.appear-sb-2 {
    .image-canvas {
      width: 250px;
      height: 250px;
    }
  }

  &.fixed-sb-0, &.fixed-sb-1, &.fixed-sb-2 {
    background: rgba($colorBg, 0);

    .container {
      h1 {
        opacity: 0;
      }

      .image-canvas {
        width: 0;
        height: 0;
      }

      .legend {
        display: none;
      }

      .image {
        box-shadow: 0 31px 81px rgba(0, 0, 0, 0.4);
      }
    }
  }

  &.fixed-sb-1, &.fixed-sb-2 {
    width: 190px;
    height: 190px;

    .container {
      top: 0;
      left: 0;
      width: 130px;
      height: 130px;
      margin-top: 0;
      transform: none;

      .image-fixed-anim {
        animation: image-fixed-anim-notif 12s $easeOutQuart infinite;
      }

      .image {
        top: 0;
        left: 0;
        width: 130px;
        height: 130px;
        margin-top: 0;
        opacity: 1;
        transform: scale(1);
        animation: none;
      }
    }
  }

  &.fixed-sb-2 {
    .container {
      .image-fixed-anim {
        animation: none;
      }

      .image {
        transform-origin: center;
        transform: scale(0);
        opacity: 0;
      }
    }
  }

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    height: 355px;
    width: 259px;
    margin-top: -70px;
  }

  h1 {
    position: absolute;
    top: 0;
    left: 50%;
    text-align: center;
    transform: translateY(180px) translateX(-50%);
    margin: 0;
    padding: 0;
    font-size: 45px;
    font-weight: 500;
    white-space: pre;
    opacity: 0;
  }

  .image-canvas {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    width: 0;
    height: 0;
    margin-top: 50px;
    overflow: hidden;

    &::before, &::after, .image-canvas-borders::before, .image-canvas-borders::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
    }

    &::before {
      top: 0;
      left: 0;
      border-top: 2px solid rgba(255, 255, 255, 0.9);
      border-left: 2px solid rgba(255, 255, 255, 0.9);
    }

    &::after {
      right: 0;
      bottom: 0;
      border-right: 2px solid rgba(255, 255, 255, 0.9);
      border-bottom: 2px solid rgba(255, 255, 255, 0.9);
    }

    .image-canvas-borders {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      &::before {
        top: 0;
        right: 0;
        border-top: 2px solid rgba(255, 255, 255, 0.9);
        border-right: 2px solid rgba(255, 255, 255, 0.9);
      }

      &::after {
        bottom: 0;
        left: 0;
        border-bottom: 2px solid rgba(255, 255, 255, 0.9);
        border-left: 2px solid rgba(255, 255, 255, 0.9);
      }
    }
  }

  .image-fixed-anim {
    position: absolute;
    border-radius: 5px;
    border: 5px solid #62bbe3;
    opacity: 0;
  }

  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 230px;
    height: 230px;
    margin-top: 50px;
    border-radius: 5px;
    opacity: 0.3;
    transform-origin: top left;
    transform: scale(0) translateY(-50%) translateX(-50%);
    animation: image-show 0.1s linear forwards;
  }

  .legend {
    position: absolute;
    bottom: 0;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    font-size: 25px;
    font-weight: 500;
    white-space: pre;
    opacity: 0;
    animation: legend-show 0.25s $easeOutQuart forwards;
  }
}
</style>

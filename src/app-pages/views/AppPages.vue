<template>
  <div class="app-pages">
    <ui-scrolls ref="scrolls" class="scrolls" content-display="block">
      <div class="content" v-html="content"></div>
    </ui-scrolls>
  </div>
</template>

<script>
import store from '@/services/store';
import UiScrolls from '@/ui/views/Scrolls.vue';
import Prism from 'prismjs';

export default {
  name: 'app-pages',
  store,
  components: {
    UiScrolls,
  },
  props: {
    config: Object,
    appRoute: String,
    appLocalRoute: String,
  },
  mounted() {
    this.clickEvent = document.ontouchstart ? 'touchstart' : 'click';
    document.addEventListener(this.clickEvent, this.clickHandler, false);

    this.load();
  },
  destroyed() {
    document.removeEventListener(this.clickEvent, this.clickHandler, false);
  },
  data() {
    return {
      clickEvent: null,
    };
  },
  computed: {
    content() {
      this.$nextTick(() => {
        Prism.highlightAll();

        this.$refs.scrolls.refresh()
      });

      return store.state.Pages.content;
    }
  },
  watch: {
    appLocalRoute() {
      this.load();
    },
  },
  methods: {
    load() {
      this.$refs.scrolls.scrollToY(0);

      this.$store.dispatch('Pages/changeAppRoute', this.appRoute);
      this.$store.dispatch('Pages/changeBase', this.config.directory);
      this.$store.dispatch('Pages/load', this.appLocalRoute || this.config.index);
    },
    clickHandler(e) {
      let el = null;
      const eventPath = e.path || (e.composedPath ? e.composedPath() : null);

      if (eventPath) {
        for (let i = 0; i < eventPath.length; i++) {
          if (
            eventPath[i].nodeName
            && eventPath[i].nodeName.toLowerCase() === 'a'
            && eventPath[i].getAttribute('local') === 'router-link') {
              el = eventPath[i];

              break;
            }
        }
      }

      if (!el) {
        return;
      }

      this.$router.push(el.getAttribute('href'));

      e.stopPropagation();
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/prism-atom-dark.css';

.app-pages {
  position: relative;
  box-sizing: border-box;
  height: 100%;

  .scrolls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .content {
    box-sizing: border-box;
    max-width: 980px;
    margin: 0 auto;
    padding: 20px 30px;
    background: rgba(0, 0, 0, 0.3);

    /deep/ {
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
      font-size: 14px;
      line-height: 1.5;
      color: #fff;

      > *:first-child {
        margin-top: 0 !important;
      }

      a, a:hover, a:visited, a:focus {
        color: #fe8033;
      }

      p {
        margin: 0 0 16px;
      }

      h1 {
        font-size: 32px;
        line-height: 40px;
        font-weight: 600;
        margin-bottom: 26px;
      }

      h2 {
        font-size: 24px;
      }

      h3 {
        font-size: 20px;
      }

      h4 {
        font-size: 16px;
      }

      p > code, li > code, h1 > code, h2 > code, h3 > code, h4 > code {
        font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
        padding: 2px 5px 3px;
        font-variant-ligatures: none;
        white-space: normal;
        color: #f5aa93;
        background-color: rgba(0, 0, 0, 0.8);
        border: 1px solid #1c3642;
        border-radius: 3px;
      }
    }
  }
}
</style>

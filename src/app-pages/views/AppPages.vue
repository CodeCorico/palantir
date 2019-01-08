<template>
  <div class="app-pages">
    <ui-scrolls ref="scrolls" class="scrolls">
      <div class="content" v-html="content"></div>
    </ui-scrolls>

    <ui-scrolls ref="sideScrolls" class="side-scrolls">
      <h2 class="title-summary">Summary</h2>

      <ul class="summary">
        <li v-for="(title, index) in summary" :key="index" :class="`level-${title.level}`">
          <a :href="`#${title.id}`">{{ title.text }}</a>
        </li>
      </ul>

      <h2 class="title-glossary">Glossary</h2>

      <div class="glossary">
        <ui-file-tree :tree="glossary" :base-url="appRoute"></ui-file-tree>
      </div>
    </ui-scrolls>
  </div>
</template>

<script>
import store from '@/services/store';
import UiScrolls from '@/ui/views/Scrolls.vue';
import UiFileTree from '@/ui/views/FileTree.vue';
import Prism from 'prismjs';

export default {
  name: 'app-pages',
  store,
  components: {
    UiScrolls,
    UiFileTree,
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
    this.loadGlossary();
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

        this.$refs.scrolls.refresh();
      });

      return this.$store.state.Pages.content;
    },
    summary() {
      this.$nextTick(() => this.$refs.sideScrolls.refresh());

      return this.$store.state.Pages.summary;
    },
    glossary() {
      this.$nextTick(() => this.$refs.sideScrolls.refresh());

      return this.$store.state.Pages.glossary;
    },
  },
  watch: {
    appLocalRoute() {
      this.load();
    },
    appRoute() {
      this.load();
      this.loadGlossary();
    },
  },
  methods: {
    load() {
      this.$refs.scrolls.scrollToY(0);

      this.$store.dispatch('Pages/changeAppRoute', this.appRoute);
      this.$store.dispatch('Pages/changeBase', this.config.directory);
      this.$store.dispatch('Pages/load', this.appLocalRoute || this.config.index);
    },
    loadGlossary() {
      this.$store.dispatch('Pages/changeBase', this.config.directory);
      this.$store.dispatch('Pages/loadGlossary');
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
@import '@/ui/assets/variables.scss';
@import '../assets/prism-atom-dark.css';

$readFont: -apple-system, BlinkMacSystemFont, Calibri, Carlito, Helvetica, Arial, sans-serif;

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
      font-family: $readFont;
      font-size: 14px;
      font-size: 17px;
      font-weight: 300;
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

  .side-scrolls {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    background: rgba(0, 0, 0, 0.8);
  }

  .title-summary, .title-glossary {
    position: relative;
    margin: 0;
    padding: 20px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
  }

  .title-summary {
    background: #0b161b;
  }

  .summary {
    box-sizing: border-box;
    margin: 0;
    padding: 0 20px 20px;
    font-size: 16px;
    list-style: square inside;
    font-family: $readFont;
    background: #0b161b;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    li {
      user-select: none;
      list-style-type: square;
      font-weight: 300;
      line-height: 1.4;

      a, a:hover, a:visited, a:focus {
        color: #fff;
        text-decoration: none;
      }

      a {
        transition: color 0.25s $easeOutQuart;

        &:hover {
          color: #fe8033;
        }
      }
    }

    .level-1 {
      list-style: none;
      margin-bottom: 5px;
      font-weight: 400;
      font-size: 20px;
    }

    .level-3 {
      padding-left: 15px;
    }

    .level-4 {
      padding-left: 30px;
    }
  }

  .glossary {
    padding: 0 20px 20px;
  }
}
</style>

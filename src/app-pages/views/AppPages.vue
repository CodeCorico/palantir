<template>
  <div class="app-pages">
    <ui-scrolls ref="scrolls" class="scrolls">
      <div ref="content" id="content" class="content" v-html="content"></div>
    </ui-scrolls>

    <div class="mask" :class="{ opened: summaryOpened }" @click="closeSummary"></div>

    <ui-scrolls ref="sideScrolls" class="side-scrolls" :class="{ opened: summaryOpened }">
      <ul class="summary" v-if="summary.length">
        <li v-for="(title, index) in summary" :key="index" :class="`level-${title.level}`">
          <a :href="`#${title.id}`" @click="closeSummary">{{ title.text }}</a>
        </li>
      </ul>

      <div class="glossary">
        <ui-file-tree :tree="glossary" :base-url="appRoute" @navigate="closeSummary"></ui-file-tree>
      </div>
    </ui-scrolls>
  </div>
</template>

<script>
import store from '@/services/store';
import UiScrolls from '@/ui/views/Scrolls.vue';
import UiFileTree from '@/ui/views/FileTree.vue';
import Prism from 'prismjs';
import Mermaid from 'mermaid';

const SCREEN_SIZES = {
  tablet: 921,
  desktop: 1321,
  large: 1545,
};

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
    window.addEventListener('resize', this.onWindowResize);

    this.onWindowResize();
    this.load();
    this.loadGlossary();
  },
  destroyed() {
    document.removeEventListener(this.clickEvent, this.clickHandler, false);
    window.removeEventListener('resize', this.onWindowResize);

    this.$store.dispatch('Page/removeSidebar', 'app-pages-menu');
    this.$store.dispatch('Pages/clear');
  },
  data() {
    return {
      clickEvent: null,
      summaryOpened: false,
    };
  },
  computed: {
    content() {
      this.$nextTick(() => {
        if (this.$store.state.Pages.content) {
          Prism.highlightAll();

          Mermaid.mermaidAPI.initialize({ startOnLoad: false }, this.$refs.content);
          Mermaid.init();
        }

        this.$refs.scrolls.refresh();
        this.$refs.scrolls.scrollToY(0);
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
    onWindowResize() {
      const below = this.$el.clientWidth < SCREEN_SIZES.desktop;

      if (below) {
        this.$store.dispatch('Page/addSidebar', {
          location: 'left',
          id: 'app-pages-menu',
          title: 'Summary',
          handler: (isSelected) => {
            this.$set(this, 'summaryOpened', isSelected);
          },
          icon: 'fas fa-align-left',
        });

        return;
      }

      this.$set(this, 'summaryOpened', false);
      this.$store.dispatch('Page/removeSidebar', 'app-pages-menu');
    },
    closeSummary() {
      if (!this.summaryOpened) {
        return;
      }

      this.$store.dispatch('Page/closeButton', {
        location: 'left',
        id: 'app-pages-menu',
      });
    },
    load() {
      this.$store.dispatch('Pages/changeAppRoute', {
        appRoute: this.appRoute,
        appLocalRoute: this.appLocalRoute,
      });
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
@import '../assets/prism-vs.css';

$screenTablet: 921px;
$screenDesktop: 1321px;
$screenLarge: 1545px;

$readFont: -apple-system, BlinkMacSystemFont, Calibri, Carlito, Helvetica, Arial, sans-serif;

.app-pages {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  background: #fff;
  color: #5f6368;

  .scrolls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .hr {
    height: 1px;
  }

  #content.content {
    box-sizing: border-box;
    max-width: 392px;
    margin: 0 auto;
    padding: 80px 16px;

    @media screen and (min-width: $screenTablet) {
      max-width: 840px;
      padding: 80px 40px;
    }

    @media screen and (min-width: $screenDesktop) {
      max-width: 1120px;
      padding: 80px 40px 80px 320px;
    }

    @media screen and (min-width: $screenLarge) {
      max-width: 1400px;
      padding: 80px 320px;
    }

    /deep/ {
      font-family: $readFont;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
      color: #5f6368;

      .mermaid {
        text-align: center;
        margin: 20px 0;
      }

      @import '../assets/mermaid.scss';

      pre[class*="language-"] {
        border-radius: 0;
        box-shadow: 0 0 8px 0 rgba(0,0,0,.08), 0 0 15px 0 rgba(0,0,0,.02), 0 0 20px 4px rgba(0,0,0,.06);
      }

      a, a:hover, a:visited, a:focus {
        font-family: $readFont;
        color: #fe8033;
      }

      p {
        margin: 0 0 16px;
      }

      img {
        max-width: 100%;
      }

      hr {
        height: 1px;
        width: 100%;
        margin: 80px 0;
        background: rgba(0,0,0,.12);
        border: 0;
      }

      h1 {
        margin: 40px 0 16px;
        font-size: 60px;
        font-weight: 400;
        line-height: 1.2;
        color: #202124;
      }

      h2 {
        margin: 48px 0 24px;
        font-size: 32px;
        font-weight: 400;
        line-height: 1.2;
        color: #202124;
      }

      h3 {
        margin: 24px 0 16px;
        font-size: 24px;
        font-weight: 400;
        line-height: 1.2;
        color: #202124;
      }

      h4 {
        margin: 24px 0 16px;
        font-size: 18px;
        font-weight: 400;
        line-height: 1.2;
        color: #5f6368;
      }

      table {
        border-spacing: 0;
      }

      table tr:nth-child(2n) {
        background: #14272f;
      }

      td {
        padding: 6px 13px;
        border-top: 1px solid #525252;
        border-left: 1px dashed #525252;

        &:last-child {
          border-right: 1px dashed #525252;
        }
      }

      tr:last-child td {
        border-bottom: 1px solid #525252;
      }

      p > code, li > code, h1 > code, h2 > code, h3 > code, h4 > code, th > code, td > code {
        font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
        padding: 2px 5px 3px;
        font-variant-ligatures: none;
        font-size: 14px;
        white-space: normal;
        color: #af3b17;
        background: #f2f2f2;
        border-radius: 3px;
      }

      .row {
        margin: 40px 0;

        &:after {
          content: "";
          display: table;
          clear: both;
        }

        h3 {
          margin: 10px 0 4px;
          color: #5f6368;
          line-height: 20px;
          font-size: 14px;
          text-transform: uppercase;
        }

        h4 {
          margin: 8px 0 0;
          font-size: 20px;
        }

        h3 a, h4 a {
          color: #5f6368;

          &:hover {
            color: #fe8033;
          }
        }
      }

      .column, .columns {
        width: 100%;
        float: left;
        box-sizing: border-box;
      }

      @media screen and (min-width: $screenTablet) {
        .column, .columns { margin-left: 4%; }
        .column:first-child, .columns:first-child { margin-left: 0; }
        .one.column, .one.columns { width: 4.66666666667%; }
        .two.columns { width: 13.3333333333%; }
        .three.columns { width: 22%; }
        .four.columns { width: 30.6666666667%; }
        .five.columns { width: 39.3333333333%; }
        .six.columns { width: 48%; }
        .seven.columns { width: 56.6666666667%; }
        .eight.columns { width: 65.3333333333%; }
        .nine.columns { width: 74.0%; }
        .ten.columns { width: 82.6666666667%; }
        .eleven.columns { width: 91.3333333333%; }
        .twelve.columns { width: 100%; margin-left: 0; }
      }
    }
  }

  .mask {
    display: none;

    &.opened {
      z-index: 1;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.5);
    }
  }

  .side-scrolls {
    z-index: 2;
    position: absolute;
    top: 0;
    left: -280px;
    bottom: 0;
    width: 280px;
    background: #fff;
    transition: left 0.25s $easeOutQuart;

    &.opened {
      left: 0;
    }

    @media screen and (min-width: $screenDesktop) {
      left: 0;
    }
  }

  .summary {
    box-sizing: border-box;
    margin: 0;
    padding: 40px 0;
    list-style: none;
    font-family: $readFont;
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    line-height: 1.5;
    color: #5f6368;
    border-bottom: 1px solid rgba(0, 0, 0, .12);

    li {
      user-select: none;
      list-style-type: none;

      a, a:hover, a:visited, a:focus {
        color: #5f6368;
        text-decoration: none;
      }

      a {
        display: block;
        padding: 10px 48px 10px 24px;
        font-family: $readFont;
        font-weight: 400;
        transition: color 0.25s $easeOutQuart;

        &:hover {
          color: #fe8033;
          background: #f5f5f5;
        }
      }

      &.level-1 {
        font-size: 18px;
        line-height: 27px;

        a, a:hover, a:visited, a:focus {
          font-weight: 600;
          color: #202124;
        }
      }

      &.level-3 a {
        padding-left: 48px;
      }

      &.level-4 a {
        padding-left: 72px;
      }
    }
  }

  .glossary {
    padding: 40px 20px;
  }
}
</style>

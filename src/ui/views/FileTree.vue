<template>
  <div
    class="ui-file-tree"
    :class="{ indented: indent > 0 && !inline, inline }"
  >
    <div class="tree-content" v-for="(item, index) in tree" :key="index">
      <div :class="{ inline }" v-if="item.path">
        <i v-if="indent > 0 && !inline" class="folder-indent fas fa-caret-right"></i>
        <span v-if="inline" class="file-indent">/</span>
        {{ item.path }}
        <ui-file-tree
          v-if="item.tree.length"
          :tree="item.tree"
          :indent="indent + 1"
          :inline="item.tree.length === 1"
          :base-url="baseUrl"
        ></ui-file-tree>
      </div>
      <div
        v-if="item.file"
        class="file"
        :class="{ inline }"
      >
        <i v-if="indent > 0 && !inline" class="folder-indent fas fa-caret-right"></i>
        <span v-if="inline" class="file-indent">/</span>
        <router-link :to="`${baseUrl}/${item.link}`">
          {{ item.file.replace('.html', '') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ui-file-tree',
  props: {
    tree: Array,
    indent: {
      type: Number,
      default: 0,
    },
    inline: Boolean,
    baseUrl: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

$readFont: -apple-system, BlinkMacSystemFont, Calibri, Carlito, Helvetica, Arial, sans-serif;

.ui-file-tree {
  position: relative;
  font-size: 13px;
  font-family: $readFont;

  &.indented {
    padding-left: 15px;
  }

  &.inline, .inline {
    display: inline;
  }

  .tree-content {
    position: relative;
    user-select: none;
    display: inline;
    font-size: 16px;
    font-weight: 300;
    line-height: 1.4;

    * {
      text-transform: lowercase;

      &:first-letter {
        text-transform: uppercase;
      }
    }
  }

  .folder-indent {
    position: absolute;
    left: -11px;
    top: 4px;
    transform: rotate(45deg);
    transform-origin: center;
    font-size: 14px;
    opacity: 0.2;
  }

  .file-indent {
    margin: 0 5px;
    font-size: 14px;
    opacity: 0.4;
  }

  .file {
    user-select: none;

    &.inline {
      display: inline;
    }

    a, a:hover, a:visited, a:focus {
      color: #fdd8c1;
      text-decoration: none;
    }

    a {
      transition: color 0.25s $easeOutQuart;

      &:hover {
        color: #fe8033;
      }
    }
  }
}
</style>

<template>
  <div
    class="ui-file-tree"
    :class="{ indented: indent > 0 && !inline, inline }"
  >
    <div class="tree-content" v-for="(item, index) in tree" :key="index">
      <div class="tree-line" :class="{ inline }" v-if="item.path">
        <span v-if="inline" class="file-indent">/</span>
        <span class="label">{{ item.path }}</span>
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
        class="file tree-line"
        :class="{ inline }"
      >
        <span v-if="inline" class="file-indent">/</span>
        <router-link :to="`${baseUrl}/${item.link}`" @click.native="$emit('navigate')">
          <i class="file-icon" :class="fileIcon(item.file)"></i>
          <span class="label">{{ fileName(item.file) }}</span>
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
  data() {
    return {
      icons: {
        md: 'fas fa-align-left',
        mmd: 'fas fa-project-diagram',
        uknown: 'fas fa-file',
      },
    };
  },
  methods: {
    fileName(file) {
      return file.replace(/.html$/i, '').replace(/.mm?d$/i, '');
    },
    fileIcon(file) {
      const ext = file.replace(/.html$/i, '').match(/\.(.*?)$/);

      return (ext && this.icons[ext[1]]) || this.icons.uknown;
    },
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
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    line-height: 1.5;
    color: #5f6368;

    .label {
      display: inline-block;
      text-transform: lowercase;

      &::first-letter {
        text-transform: uppercase;
      }
    }
  }

  .tree-line {
    padding: 4px 0;
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
      color: #fe8033;
      text-decoration: none;
    }

    a {
      transition: color 0.25s $easeOutQuart;

      &:hover {
        color: #d46423;
      }

      .file-icon {
        position: relative;
        top: -1px;
        font-size: 11px;
        margin-right: 6px;
      }
    }
  }
}
</style>

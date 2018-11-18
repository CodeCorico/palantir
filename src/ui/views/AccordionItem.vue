<template>
  <div
    class="ui-accordion-item"
    :class="{ opened }"
    :style="{ height: `${height}px` }"
    @click="toggleOpen()"
  >
    <h2 ref="title">
      <i v-if="icon" class="icon" :class="[icon]"></i>
      {{ title }}
      <i class="fas fa-angle-down ticker"></i>
    </h2>
    <ul class="content" ref="content">
      <li v-for="listItem in list" :key="listItem.text">
        <a :href="listItem.url">
          <i v-if="listItem.icon" class="list-item-icon" :class="[listItem.icon]"></i>
          {{ listItem.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ui-accordion-item',
  props: {
    title: String,
    icon: String,
    list: Array,
  },
  data() {
    return {
      contentHeight: null,
      opened: false,
      height: 46,
    };
  },
  created () {
    this.$parent.$on('accordion-close', (except) => {
      if (except === this) {
        return;
      }

      this.toggleOpen(false);
    });
  },
  methods: {
    toggleOpen(force) {
      const open = typeof force === 'boolean' ? force : !this.opened;

      if (open) {
        this.$set(this, 'height', this.$refs.title.clientHeight + this.$refs.content.clientHeight);
      } else {
        this.$set(this, 'height', this.$refs.title.clientHeight);
      }

      this.$set(this, 'opened', open);
      this.$emit(open ? 'open' : 'close');
      this.$parent.$emit(open ? 'accordion-item-open' : 'accordion-item-close', this);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/ui/assets/variables.scss';

.ui-accordion-item {
  position: relative;
  height: 38px;
  overflow: hidden;
  transition: height .35s $easeOutCirc;

  &.opened {
    > h2 {
      color: rgba(255, 255, 255, 0.9);
      background: rgba($colorPanelLighter, 0.5);

      .ticker {
        transform: rotate(180deg);
      }
    }
  }

  > h2 {
    user-select: none;
    cursor: pointer;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    height: 46px;
    margin: 0;
    padding: 12px 20px;
    font-size: 16px;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.6);
    background: $colorPanelDarker;
    border-radius: 5px;

    &:hover {
      color: rgba(255, 255, 255, 0.9);
      background: $colorPanelLighter;
    }

    .icon {
      margin-right: 10px;
    }

    .ticker {
      float: right;
      transition: all .35s $easeOutCirc;
    }
  }

  > .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 20px;
    margin: 0;

    li {
      list-style: none;
      margin: 0;

      a, a:hover, a:focus, a:visited {
        color: rgba($colorText, 0.7);
        text-decoration: none;
      }

      a {
        display: block;
        font-size: 13px;
        padding: 4px 0;

        &:hover {
          color: $colorText;
        }

        .list-item-icon {
          margin-right: 10px;
          width: 18px;
        }
      }
    }
  }
}
</style>

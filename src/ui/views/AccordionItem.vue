<template>
  <div
    class="ui-accordion-item"
    :class="{ opened }"
    :style="{ height: `${height}px` }"
  >
    <h2 ref="title" @click="toggleOpen()">
      <i v-if="icon" class="icon" :class="[icon]"></i>
      {{ title }}
      <i class="fas fa-angle-down ticker"></i>
    </h2>
    <div class="content" ref="content">
      <div v-if="selectors" class="selector">
        <select v-model="selected">
          <option v-for="selector in selectors" :key="selector" :value="selector">
            {{ selector }}
          </option>
        </select>
      </div>
      <ul>
        <li v-for="(listItem, listItemIndex) in listFilter(list)" :key="listItemIndex">
          <router-link
            :to="listItem.url || '/'"
            :target="listItem.external ? '_blank' : ''"
            @click.native="$emit('navigate')"
          >
            <i
              v-if="listItem.icon"
              class="list-item-icon"
              :class="[listItem.icon]"
            ></i>
            {{ listItem.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ui-accordion-item',
  props: {
    title: String,
    icon: String,
    list: Array,
    selectors: Array,
  },
  data() {
    return {
      contentHeight: null,
      opened: false,
      height: 46,
      selected: this.selectors ? this.selectors[0] : null,
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
    refreshLayout() {
      this.$set(
        this,
        'height',
        this.$refs.title.clientHeight + (this.opened ? this.$refs.content.clientHeight : 0),
      );
    },
    toggleOpen(force) {
      const open = typeof force === 'boolean' ? force : !this.opened;

      this.$set(this, 'opened', open);

      this.refreshLayout();

      this.$emit(open ? 'open' : 'close');
      this.$parent.$emit(open ? 'accordion-item-open' : 'accordion-item-close', this);

      setTimeout(() => {
        this.$emit(open ? 'open-after' : 'close-after');
      }, 400);
    },
    listFilter(list) {
      if (!this.selected) {
        return list;
      }

      this.$nextTick(() => this.refreshLayout());

      return list.filter(item => !item.selectors
        ? true
        : item.selectors.indexOf(this.selected) > -1);
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
      background: $colorPanelLighter;

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

    &:hover {
      color: rgba(255, 255, 255, 0.9);
      background: $colorPanelLighter;
    }

    .icon {
      margin-right: 10px;
    }

    .ticker {
      position: relative;
      top: 2px;
      float: right;
      transition: all .35s $easeOutCirc;
    }
  }

  > .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    > .selector {
      padding: 10px 20px 0;

      select {
        border: none;
        padding: 6px;
        width: 100%;
        background: $colorPanelLighter;
        color: $colorText;

        &:focus, &:active {
          outline: none;
        }
      }
    }

    > ul {
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
}
</style>

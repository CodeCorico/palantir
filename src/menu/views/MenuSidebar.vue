<template>
  <sidebar
    ref="sidebar"
    :position="position"
    :opened="opened"
  >
    <ui-accordion>
      <div v-for="(category, categoryIndex) in menu" :key="categoryIndex">
        <h1>{{ category.title }}</h1>

        <ui-accordion-item
          v-for="(section, sectionIndex) in category.sections"
          :key="sectionIndex"
          :title="section.title"
          :list="section.links"
          :selectors="section.selectors"
          @open-after="onOpenCloseItem"
          @close-after="onOpenCloseItem"
          @navigate="onNavigate"
        ></ui-accordion-item>
      </div>
    </ui-accordion>
  </sidebar>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import Sidebar from '@/layouts/views/Sidebar.vue';
import UiAccordion from '@/ui/views/Accordion.vue';
import UiAccordionItem from '@/ui/views/AccordionItem.vue';

export default {
  name: 'menu-sidebar',
  store,
  components: {
    Sidebar,
    UiAccordion,
    UiAccordionItem,
  },
  props: {
    position: {
      type: String,
      required: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    menu() {
      this.$nextTick(() => this.$refs.sidebar.refresh());

      return this.$store.state.Menu.menu;
    }
  },
  methods: {
    onOpenCloseItem() {
      this.$nextTick(() => this.$refs.sidebar.refresh());
    },
    onNavigate() {
      this.$store.dispatch('Page/toggleButton', {
        location: 'left',
        id: 'menu-sidebar',
      });
    },
  },
};
</script>

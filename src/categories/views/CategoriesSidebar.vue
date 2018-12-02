<template>
  <ui-sidebar
    :position="position"
    :opened.sync="opened"
    @open="$emit('open')"
    @close="$emit('close')"
  >
    <ui-accordion>
      <div v-for="(category, cateoryIndex) in categories" :key="cateoryIndex">
        <h1>{{ category.title }}</h1>

        <ui-accordion-item
          v-for="(section, sectionIndex) in category.sections"
          :key="sectionIndex"
          :title="section.title"
          :list="section.links"
          :selectors="section.selectors"
        ></ui-accordion-item>
      </div>
    </ui-accordion>
  </ui-sidebar>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/services/store';
import UiSidebar from '@/ui/views/Sidebar.vue';
import UiAccordion from '@/ui/views/Accordion.vue';
import UiAccordionItem from '@/ui/views/AccordionItem.vue';

export default {
  name: 'categories-sidebar',
  store,
  components: {
    UiSidebar,
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
    ...mapState('Config', ['categories']),
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.$store.dispatch('Config/load');
    },
  },
};
</script>

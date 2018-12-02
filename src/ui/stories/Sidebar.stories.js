import { storiesOf } from '@storybook/vue';
import { text } from '@storybook/addon-knobs';

import Sidebar from '../Sidebar.vue';

storiesOf('Layout', module)
  .add('Sidebar', () => {
    const color = text('Color', 'black');
    return {
      components: {
        Sidebar,
      },
      template: `
<palantir-sidebar
  :color="${color}"
>
</palantir-header>
`,
      data() {
        return {
          hello: 'Sidebar',
        };
      },
    };
  });

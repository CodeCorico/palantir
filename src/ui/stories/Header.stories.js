import { storiesOf } from '@storybook/vue';
import { text } from '@storybook/addon-knobs';

import Header from '../views/Header.vue';
import Logo from './logo.jpg';

storiesOf('Layout', module)
  .add('Header', () => {
    const logo = text('Logo', Logo);
    const url = text('URL', '');

    return {
      components: {
        Header,
      },
      template: `
<palantir-header
  :logo="${logo}"
  :url= "${url}"
>
</palantir-header>
`,
      data() {
        return {
          hello: 'Header',
        };
      },
    };
  });

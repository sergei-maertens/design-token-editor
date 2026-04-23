/**
 * Ensure you are running `npm start` or have built the CSS using `npm run build:sass`
 * and `npm run build:design-tokens`.
 */
import '../lib/css/dte.css';
import '../lib/css/index.css';

import {Preview} from '@storybook/react-webpack5';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Introduction', 'Public API', 'Private API'],
      },
    },
  },
};

export default preview;

/**
 * Ensure you are running `npm start` or have built the CSS using `npm run build:sass`
 * and `npm run build:design-tokens`.
 */
import '../lib/css/dte.css';
import '../lib/css/index.css';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
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
};

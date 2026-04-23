import {Meta, StoryObj} from '@storybook/react-webpack5';

import TokenFilter from './TokenFilter';

export default {
  title: 'Private API/TokenFilter',
  component: TokenFilter,
} satisfies Meta<typeof TokenFilter>;

type Story = StoryObj<typeof TokenFilter>;

export const Default: Story = {
  name: 'Default',

  args: {
    filters: {
      query: 'a query',
      mode: 'curated',
    },
  },
};

import {Meta, StoryObj} from '@storybook/react-webpack5';

import TokenFilter from './TokenFilter';

const meta = {
  title: 'Private API/TokenFilter',
  component: TokenFilter,
} satisfies Meta<typeof TokenFilter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',

  args: {
    filters: {
      query: 'a query',
      mode: 'curated',
    },
  },
};

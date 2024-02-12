import {Meta, StoryObj} from '@storybook/react';
// @ts-expect-error
import ofDesignTokens from '@open-formulieren/design-tokens/dist/tokens.js';
import utrechtDesignTokens from '@utrecht/design-tokens/dist/tokens.js';

import TokensTable from './TokensTable';

const meta = {
  title: 'Public API/TokensTable',
  component: TokensTable,
  args: {
    limitTo: '',
    filterEnabled: false,
    container: ofDesignTokens,
  },
} satisfies Meta<typeof TokensTable>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  name: 'Default',
};

export const LimitedToComponent: Story = {
  name: 'Limited to component',

  args: {
    limitTo: 'of.button',
    autoExpand: true,
  },
};

export const FiltersEnabled: Story = {
  name: 'Filters enabled',

  args: {
    filterEnabled: true,
    autoExpand: true,
  },
};

export const UtrechtTokens: Story = {
  name: 'Utrecht tokens',

  args: {
    container: utrechtDesignTokens,
    limitTo: 'utrecht.alert.',
    autoExpand: false,
  },
};

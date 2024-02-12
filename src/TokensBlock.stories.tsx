import {Meta, StoryObj} from '@storybook/react';
// @ts-expect-error
import ofDesignTokens from '@open-formulieren/design-tokens/dist/tokens.js';

import TokensBlock from './TokensBlock';
import type {DesignToken} from './types';

const colorTokens = Object.values(ofDesignTokens.of.color).filter(
  (potentialToken: DesignToken) => 'value' in potentialToken
) as DesignToken[];

const meta = {
  title: 'Public API/TokensBlock',
  component: TokensBlock,
} satisfies Meta<typeof TokensBlock>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',

  args: {
    path: ['of', 'color'],
    tokens: colorTokens,
    container: {},
  },
};

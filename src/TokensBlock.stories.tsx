import {Meta, StoryObj} from '@storybook/react-webpack5';
// @ts-expect-error
import ofDesignTokens from '@open-formulieren/design-tokens/dist/tokens.js';

import TokensBlock from './TokensBlock';
import type {DesignToken} from './types';

const colorTokens = Object.values(ofDesignTokens.of.color).filter(
  (potentialToken: DesignToken) => 'value' in potentialToken
) as DesignToken[];

export default {
  title: 'Public API/TokensBlock',
  component: TokensBlock,
} satisfies Meta<typeof TokensBlock>;

type Story = StoryObj<typeof TokensBlock>;

export const Default: Story = {
  name: 'Default',

  args: {
    path: ['of', 'color'],
    tokens: colorTokens,
    container: {},
  },
};

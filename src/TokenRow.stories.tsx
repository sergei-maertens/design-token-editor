import {Meta, StoryObj, StoryFn} from '@storybook/react';
// @ts-expect-errors
import ofDesignTokens from '@open-formulieren/design-tokens/dist/tokens.js';

import TokenRow from './TokenRow';

type TokenRowPropsAndCustomArgs = React.ComponentProps<typeof TokenRow> & {
  contained?: boolean;
};

const meta = {
  title: 'Private API/TokenRow',
  component: TokenRow,
  args: {
    contained: false,
  },
} satisfies Meta<TokenRowPropsAndCustomArgs>;
export default meta;

const render: StoryFn<TokenRowPropsAndCustomArgs> = ({
  designToken,
  contained = false,
}) => (
  <div className={contained ? 'dte-tokens-block' : ''}>
    <TokenRow designToken={designToken} />
  </div>
);

type Story = StoryObj<TokenRowPropsAndCustomArgs>;

export const Default: Story = {
  render,
  name: 'Default',

  args: {
    designToken: ofDesignTokens.of['page-footer'].bg,
    contained: false,
  },
};

export const Contained: Story = {
  render,
  name: 'Contained',

  args: {
    designToken: ofDesignTokens.of['summary-row'].spacing,
    contained: true,
  },
};

export const CssColorInherit: Story = {
  render,
  name: 'CSS color: inherit',

  args: {
    designToken: {
      name: 'ofColorFg',
      value: 'inherit',

      original: {
        value: 'inherit',
      },

      path: ['of', 'color', 'fg'],
      attributes: {},
    },

    contained: false,
  },
};

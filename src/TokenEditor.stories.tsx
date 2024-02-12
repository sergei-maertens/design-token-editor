import {useState} from 'react';
import {Meta, StoryObj, StoryFn} from '@storybook/react';
// @ts-expect-error
import ofDesignTokens from '@open-formulieren/design-tokens/dist/tokens.js';

import TokenEditor from './TokenEditor';
import type {TopLevelContainer} from './types';

const meta = {
  title: 'Public API/TokenEditor',
  component: TokenEditor,
} satisfies Meta<typeof TokenEditor>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',

  args: {
    tokens: ofDesignTokens,

    initialValues: {
      // TODO: look into better (recursive) type definitions
      // @ts-expect-error
      of: {
        button: {
          primary: {
            bg: {
              value: '#0177b2',
            },
          },
        },
      },
    },
  },
};

const callbackRender: StoryFn<typeof TokenEditor> = ({tokens, initialValues}) => {
  const [changeCounter, setChangeCounter] = useState(0);
  const [values, setValues] = useState(initialValues);

  const onChange = (newValues: TopLevelContainer) => {
    setValues(newValues);
    setChangeCounter(changeCounter + 1);
  };

  return (
    <>
      <div style={{padding: '1em', marginBottom: '1em', background: '#eee'}}>
        <div>Changes received: {changeCounter}</div>
        <code>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </code>
      </div>
      <TokenEditor tokens={tokens} initialValues={initialValues} onChange={onChange} />
    </>
  );
};

export const OnChangeCallback: Story = {
  render: callbackRender,
  name: 'onChange callback',

  args: {
    tokens: ofDesignTokens,

    initialValues: {
      // TODO: look into better (recursive) type definitions
      // @ts-expect-error
      of: {
        button: {
          primary: {
            bg: {
              value: '#0177b2',
            },
          },
        },
      },
    },
  },
};

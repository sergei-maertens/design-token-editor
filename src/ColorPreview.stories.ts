import {Meta, StoryObj} from '@storybook/react';

import ColorPreview from './ColorPreview';

const meta = {
  title: 'Private API/ColorPreview',
  component: ColorPreview,
} satisfies Meta<typeof ColorPreview>;
export default meta;

type Story = StoryObj<typeof meta>;

export const HEX: Story = {
  name: 'Hex',

  args: {
    color: '#FF0000',
  },
};

export const RGB: Story = {
  name: 'RGB',

  args: {
    color: 'rgb(0, 255, 0)',
  },
};

export const RGBA: Story = {
  name: 'RGBA',

  args: {
    color: 'rgba(0, 0, 255, 0.5)',
  },
};

export const HSLA: Story = {
  name: 'HSLA',

  args: {
    color: 'hsla(20, 80%, 75%, 1)',
  },
};

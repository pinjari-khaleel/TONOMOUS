import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import A01Example from './data/example.yaml';

export default {
  title: 'NEOM/atom/A01 Image',
  component: require('./A01Image'),
  argTypes: {
    scrollComponent: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    disableTransition: {
      control: { type: 'boolean' },
      description: 'Disables the built-in transition timeline',
      defaultValue: true,
    },
    direction: {
      control: { type: 'radio', options: [0, 1, 2, 3] },
    },
    variant: {
      control: { type: 'radio', options: ['none', 'contain', 'block'] },
      description:
        'By default the image renders with object-fit: cover, variants exist to change these to contain or render without absolute positioning.',
    },
    src: {
      control: { type: 'text' },
      description: 'Location of the default image asset',
    },
    alt: {
      control: { type: 'text' },
      description:
        'Describes an alternative description for the image for screen readers and when images are not loaded.',
    },
    loading: {
      control: { type: 'radio', options: ['lazy', 'eager', 'auto'] },
      description: '',
      defaultValue: 'lazy',
    },
    poster: {
      control: { type: 'boolean' },
      description:
        'Defines whether the image is being used as a poster element for video purposes.',
    },
    sources__0__src: {
      control: {
        type: 'text',
      },
    },
    sources__0__media: {
      control: {
        type: 'text',
      },
    },
    sources__1__src: {
      control: {
        type: 'text',
      },
    },
    sources__1__media: {
      control: {
        type: 'text',
      },
    },
    sources__2__src: {
      control: {
        type: 'text',
      },
    },
    sources__2__media: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Renders an responsive image component. The size of this atom component is controlled by its parent component.',
      },
    },
  },
};

const Template = (ratio: string) => ({
  template: `<hbs>
    <div style="position:relative;width:420px;height:420px;background:rgba(0,0,0,0.15)" class="u-imageRatio -{{$ratio}}">{{> a01-image }}</div>
  </hbs>`,
});

export const Default = () => ({
  template: `<hbs>
    <div style="position:relative;width:420px;height:420px;background:rgba(0,0,0,0.15)">{{> a01-image }}</div>
  </hbs>`,
});

export const LandscapeImageRatio = () => ({
  template: `<hbs>
    <div class="u-imageRatio -landscape">{{> a01-image }}</div>
  </hbs>`,
});

export const PortraitImageRatio = () => ({
  template: `<hbs>
    <div class="u-imageRatio -portrait">{{> a01-image }}</div>
  </hbs>`,
});

export const SquareImageRatio = () => ({
  template: `<hbs>
    <div class="u-imageRatio -square">{{> a01-image }}</div>
  </hbs>`,
});

export const WidescreenImageRatio = () => ({
  template: `<hbs>
    <div class="u-imageRatio -widescreen">{{> a01-image }}</div>
  </hbs>`,
});

export const CircleImageRatio = () => ({
  template: `<hbs>
    <div class="u-imageRatio -circle">{{> a01-image }}</div>
  </hbs>`,
});

Default.args = A01Example;
LandscapeImageRatio.args = flattenProps(A01Example);
PortraitImageRatio.args = flattenProps(A01Example);
SquareImageRatio.args = flattenProps(A01Example);
WidescreenImageRatio.args = flattenProps(A01Example);
CircleImageRatio.args = flattenProps(A01Example);

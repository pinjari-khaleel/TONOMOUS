/* eslint-disable no-template-curly-in-string,global-require */
import buttonExamples from './data/examples.yaml';

const svgContext = require.context('app/svg/icon/?inline', false, /\.svg/);
const svgNames = svgContext
  .keys()
  .map((path) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  title: 'NEOM/molecule/M02 Button',
  component: require('./M02Button'),
  argTypes: {
    theme: {
      control: { type: 'select', options: ['black', 'white', 'gold', 'dark-gold', 'cream'] },
      description: "Specifies the button's theme.",
    },
    level: {
      control: { type: 'radio', options: ['primary', 'secondary', 'tertiary'] },
      description: 'The CTA button level helps visually distinguish the importance of a CTA.',
    },
    size: {
      control: { type: 'check', options: ['small'] },
      description: 'Toggle small size on or off.',
    },
    icon: {
      control: { type: 'select', options: svgNames },
      description: 'Specifies an icon. Leave blank for no icon',
    },
    label: {
      control: { type: 'text' },
      description: "Specifies the button's text label. Leave blank for no label",
    },
    iconAlignment: {
      control: { type: 'radio', options: ['right', 'left'] },
      description: 'Swaps out the icon and label when aligned left.',
    },
    prefix: {
      control: { type: 'text' },
      description: '',
    },
    suffix: {
      control: { type: 'text' },
      description: '',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Renders a CTA button with either an icon, label or both. Several themes, levels and sizes are available.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs><div style="text-align: center">{{> m02-button @root }}</div></hbs>`,
});

export const PrefixSuffix = () => ({
  template: `<hbs><div style="text-align: center">{{> m02-button @root }}</div></hbs>`,
});

export const CTAExamples = () => ({
  template: `<hbs>{{#each buttonExamples}}{{> m02-button}}{{/each}}{{> m02-button @root}}</hbs>`,
  data: { buttonExamples },
});

CTAExamples.args = {
  theme: 'dark-gold',
  icon: 'arrow-right',
};

PrefixSuffix.args = {
  icon: 'play-outline',
  level: 'secondary',
  prefix: 'Watch',
  suffix: 'Video',
};

Default.args = {
  label: 'M02 Button',
  icon: null,
  level: 'secondary',
  theme: 'black',
  iconAlignment: 'right',
};

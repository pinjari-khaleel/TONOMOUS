import A08PageIndicatorProps from './A08PageIndicator.types';

export default {
  title: 'NEOM/atom/A08 Page-indicator',
  component: require('./A08PageIndicator'),
  argTypes: {
    active: {
      control: { type: 'boolean' },
      description: 'Controls active state',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a page indicator.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
            {{> a08-page-indicator }}
        </hbs>`,
});

const defaultProps: A08PageIndicatorProps = {
  active: true,
};

Default.args = defaultProps;

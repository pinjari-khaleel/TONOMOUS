import A09TimeIndicator from './A09TimeIndicator';
import { A09TimeIndicatorProps } from './A09TimeIndicator.types';

export default {
  title: 'NEOM/atom/A09 Time-indicator',
  component: require('./A09TimeIndicator'),
  argTypes: {
    variant: {
      control: { type: 'text' },
      description: 'Determines which variant it needs to be',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a time indicator',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
        {{> a09-time-indicator @root }}
        </hbs>`,
});

export const Variant = () => {
  const data: {
    items: Array<A09TimeIndicatorProps>;
  } = {
    items: [
      {
        variant: 'tooltip',
      },
    ],
  };
  return {
    template: `<hbs>
            {{#each items}}
                {{> a09-time-indicator @root }}
            {{/each}}
        </hbs>`,
    data,
  };
};

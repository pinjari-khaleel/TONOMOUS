/* eslint-disable no-template-curly-in-string,global-require */
import A05MoustacheProps from './A05Moustache.types';
export default {
  title: 'NEOM/atom/A05 Moustache',
  component: require('./A05Moustache'),
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Specifies the moustache text.',
    },
    size: {
      control: { type: 'select', options: ['small', 'large'] },
      description: 'Specifies the moustache size',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a moustache component.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
        {{> a05-moustache }}
      </hbs>`,
});

const defaultProps: A05MoustacheProps = {
  text: 'Moustache',
  size: 'large',
};

Default.args = defaultProps;

export const Sizes = () => {
  const data: {
    items: Array<A05MoustacheProps>;
  } = {
    items: [
      {
        text: 'Small sized moustache',
        size: 'small',
      },
      {
        text: 'Large sized moustache',
        size: 'large',
      },
    ],
  };

  return {
    template: `<hbs>
                {{#each items}}
                  {{> a05-moustache }}
                {{/each}}
            </hbs>`,
    data,
  };
};

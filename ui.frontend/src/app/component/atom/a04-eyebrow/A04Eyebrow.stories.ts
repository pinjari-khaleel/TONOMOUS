/* eslint-disable no-template-curly-in-string,global-require */

export default {
  title: 'NEOM/atom/A04 Eyebrow',
  component: require('./A04Eyebrow'),
  argTypes: {
    text: {
      control: { type: 'text' },
      description:
        'Specifies the eyebrow text. Is not a rich text element, so cannot contain HTML.',
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'Specifies the eyebrow size',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an eyebrow component.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{> a04-eyebrow @root}}
    </hbs>`,
});

Default.args = {
  text: 'Eyebrow',
  size: 'medium',
};

export const Sizes = () => ({
  template: `<hbs>
        {{#each items}}
          {{> a04-eyebrow text=text size=size }}
        {{/each}}
    </hbs>`,
  data: {
    items: [
      {
        text: 'Large eyebrow',
        size: 'large',
      },
      {
        text: 'Medium eyebrow',
        size: 'medium',
      },
      {
        text: 'Small eyebrow',
        size: 'small',
      },
    ],
  },
});

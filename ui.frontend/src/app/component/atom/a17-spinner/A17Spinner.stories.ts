export default {
  title: 'NEOM/atom/A17 Spinner',
  component: require('./A17Spinner'),
  argTypes: {
    size: {
      control: { type: 'select', options: ['none', 'large'] },
      description: 'Specifies the spinner size',
    },
    scrollComponent: {
      control: {
        type: 'boolean',
      },
      table: {
        disable: true,
      },
      description: 'Toggles HTML scrollComponent attribute.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a spinner element.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{> a17-spinner @root}}
    </hbs>`,
});

Default.args = {
  size: 'none',
  scrollComponent: false,
};

export const Large = () => ({
  template: `<hbs>
        {{#each items}}
           {{> a17-spinner size=size}}
        {{/each}}
    </hbs>`,
  data: {
    items: [
      {
        size: 'large',
      },
    ],
  },
});

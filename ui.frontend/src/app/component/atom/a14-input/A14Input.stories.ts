export default {
  title: 'NEOM/atom/A14 Input',
  component: require('./A14Input'),
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Toggles the disabled state of the input element.',
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['text', 'password', 'email', 'number', 'hidden'],
      },
    },
    value: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an HTML text input component.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{> a14-input @root}}
    </hbs>`,
});

Default.args = {
  placeholder: 'Placeholder text',
  type: 'text',
};

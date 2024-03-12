/* eslint-disable no-template-curly-in-string,global-require */

export default {
  title: 'NEOM/atom/A16 Textarea',
  component: require('./A16Textarea'),
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Toggles the disabled state of the textarea element.',
    },
    required: {
      control: {
        type: 'boolean',
      },
      table: {
        disable: true,
      },
      description: 'Toggles the required state of the textarea element.',
    },
    readonly: {
      control: {
        type: 'boolean',
      },
      description: 'Toggles the readonly state of the textarea element.',
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    id: {
      control: {
        type: 'text',
      },
      table: {
        disable: true,
      },
    },
    name: {
      control: {
        type: 'text',
      },
      table: {
        disable: true,
      },
    },
    titleInEnglish: {
      control: {
        type: 'text',
      },
      table: {
        disable: true,
      },
    },
    value: {
      control: {
        type: 'text',
      },
      table: {
        disable: true,
      },
    },
    validate: {
      control: {
        type: 'text',
      },
      table: {
        disable: true,
      },
    },
    maxlength: {
      control: {
        type: 'range',
        min: 1,
        max: 200,
        step: 3,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an HTML textarea component.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{> a16-textarea @root}}
    </hbs>`,
});

Default.args = {
  placeholder: 'Placeholder text',
};

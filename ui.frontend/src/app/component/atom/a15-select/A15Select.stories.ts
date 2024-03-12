import A15Data from './data/default.yaml';

export default {
  title: 'NEOM/atom/A15 Select',
  component: require('./A15Select'),

  argTypes: {
    autocomplete: {
      control: {
        type: 'boolean',
      },
      description: 'Toggles HTML autocomplete attribute.',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Toggles HTML disabled attribute.',
    },
    id: {
      control: {
        type: 'text',
      },
      table: {
        disable: true,
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    items: {
      control: {
        type: 'object',
      },
    },
    label: {
      control: {
        type: 'text',
      },
      table: {
        disable: true,
      },
    },
    selected: {
      control: {
        type: 'boolean',
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
    required: {
      control: {
        type: 'boolean',
      },
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a select element.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs><div>
    {{> a15-select @root}}</div>
    </hbs>`,
});

Default.args = A15Data;

export default {
  title: 'NEOM/atom/A12 radio',
  component: require('./A12Radio'),
  argTypes: {
    checked: {
      control: {
        type: 'boolean',
      },
      description: 'Toggles HTML checked attribute.',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Toggles HTML disabled attribute.',
    },
    required: {
      control: {
        type: 'boolean',
      },
      table: {
        disable: true,
      },
      description: 'Toggles HTML required attribute.',
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
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a radio element.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs> <div style="
  --component-highlight-color: var(--color-dark-gold);
  --radio-active-color: var(--color-dark-gold);
  --radio-background-color: var(--color-white);
  --radio-border-color: var(--color-black-10);
  --radio-border-radius: 50%;
  --radio-size: 20px;">
       {{> a12-radio @root}}</div>
    </hbs>`,
});

Default.args = {
  id: 'a12-radio-id',
  name: 'a12-radio-name',
  titleInEnglish: 'a12 Radio Name',
  value: 'a12-radio-value',
};

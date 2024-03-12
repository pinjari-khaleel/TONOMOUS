export default {
  title: 'NEOM/atom/A11 Checkbox',
  component: require('./A11Checkbox'),
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
        component: 'Renders a checkbox element.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs><div style="
    --component-highlight-color: var(--color-dark-gold);
    --checkbox-active-background-color: var(--component-highlight-color);
    --checkbox-background-color: var(--color-white);
    --checkbox-border-color: var(--color-gold-50);
    --checkbox-border-radius: var(--input-border-radius);
    --checkbox-border-width: var(--input-border-width);
    --checkbox-checkmark-color: var(--color-white);
    --checkbox-size: 20px;">
      {{> a11-checkbox @root}}</div>
    </hbs>`,
});

Default.args = {
  id: 'a11-checkbox-id',
  name: 'a11-checkbox-name',
  titleInEnglish: 'a11 Checkbox Name',
  value: 'a11-checkbox-value',
};

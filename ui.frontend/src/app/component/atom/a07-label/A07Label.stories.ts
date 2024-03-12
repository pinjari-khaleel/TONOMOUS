import A07Label from './A07Label';
import A07LabelProps from './A07Label.types';

export default {
  component: A07Label,
  title: 'NEOM/atom/A07 Label',
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Specifies the label text. Is not a rich text element, so cannot contain HTML.',
    },
    size: {
      control: { type: 'inline-radio', options: ['small', 'undefined'] },
      description: 'Specifies the label size',
    },
    variant: {
      control: { type: 'select', options: ['footerLink', 'checkbox', 'marginaliaLink'] },
      description: 'Specifies the label variant',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders an label component.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>{{> a07-label @root}}</hbs>`,
});

export const Sizes = () => {
  const data: {
    items: Array<A07LabelProps>;
  } = {
    items: [
      {
        text: 'Small sized label',
        size: 'small',
      },
      {
        text: 'Large sized label',
        size: undefined,
      },
    ],
  };

  return {
    template: `<hbs>{{#each items}}<div>{{>a07-label}}</div>{{/each}}</hbs>`,
    data,
  };
};

export const Variants = () => {
  const data: {
    items: Array<A07LabelProps>;
  } = {
    items: [
      {
        text: 'Footer link label',
        variant: 'footerLink',
      },
      {
        text: 'Checkbox label',
        variant: 'checkbox',
      },
      {
        text: 'Marginalia link label',
        variant: 'marginaliaLink',
      },
    ],
  };

  return {
    template: `<hbs>{{#each items}}<div>{{>a07-label}}</div>{{/each}}</hbs>`,
    data,
  };
};

Default.args = {
  text: 'Label text',
  size: 'undefined',
};

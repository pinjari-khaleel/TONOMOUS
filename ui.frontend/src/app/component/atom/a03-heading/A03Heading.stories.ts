/* eslint-disable no-template-curly-in-string,global-require */

export default {
  title: 'NEOM/atom/A03 Heading',
  component: require('./A03Heading'),
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Specifies the heading text. Is a rich text element, so can contain HTML.',
    },
    element: {
      control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      description: 'Specifies the HTML element',
    },
    size: {
      control: { type: 'select', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      description: 'Specifies the heading size',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Renders a heading component.',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
      {{> a03-heading @root}}
    </hbs>`,
});

Default.args = {
  text: 'Lorem Ipsum',
  element: 'h2',
};

export const Sizes = () => ({
  template: `<hbs>
        {{#each items}}
          {{> a03-heading text=text size=size }}
        {{/each}}
    </hbs>`,
  data: {
    items: [
      {
        text: 'h1-sized heading',
        size: 'h1',
      },
      {
        text: 'h2-sized heading',
        size: 'h2',
      },
      {
        text: 'h3-sized heading',
        size: 'h3',
      },
      {
        text: 'h4-sized heading',
        size: 'h4',
      },
      {
        text: 'h5-sized heading',
        size: 'h5',
      },
      {
        text: 'h6-sized heading',
        size: 'h6',
      },
      {
        text: 'h7-sized heading',
        size: 'h7',
      },
    ],
  },
});

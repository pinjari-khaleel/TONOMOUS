export default {
  title: 'NEOM/molecule/M10 Scroll Button',
  component: require('./M10ScrollButton'),
  argTypes: {},
  parameters: {
    docs: {
      description: {
        component: 'Renders only one icon to make component scrollable',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
    {{> m10-scroll-button }}
  </hbs>`,
});

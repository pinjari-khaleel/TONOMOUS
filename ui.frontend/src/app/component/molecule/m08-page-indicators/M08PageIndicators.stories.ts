export default {
  title: 'NEOM/molecule/M08 Page Indicators',
  component: require('./M08PageIndicators'),
  parameters: {
    docs: {
      description: {
        component: 'Renders a set of pagination items to depict pagination UI for usage in sliders',
      },
    },
  },
};

export const Default = () => ({
  template: `<hbs>
<div style="padding:20px;text-align: center;">{{> m08-page-indicators @root }}</div><div class="-dark" style="padding:20px;background-color: var(--color-black);text-align: center;">{{> m08-page-indicators @root }}</div>

</hbs>`,
  data: { items: [{ active: false }, { active: true }, { active: false }, { active: false }] },
});

Default.args = {};

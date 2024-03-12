import { Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import A02Icon, { svgContext } from './A02Icon';

const iconNames = svgContext
  .keys()
  .map((path: string) => path.replace(/\.\/([a-z-]+)\.svg/gi, (_, name) => name));

export default {
  component: A02Icon,
  title: 'NEOM/atom/A02 Icon',
  parameters: {
    docs: {
      description: {
        component:
          'Renders the svgs from the `/app/svg/icon/*.svg` folder as a component in the HTML, by providing the `name` property.',
      },
    },
  },
} as Meta;

export const Default = () => ({
  template: `<hbs>
    <div>
      <ul style="list-style: none; margin: 0;
      padding: 0; display:flex; gap: 20px; flex-wrap: wrap;">
        {{#each iconNames}}
        <li style="--icon-size: 80px; flex: 0 0 80px; width: 80px height: 80px; text-align: center;">
          {{> a02-icon name=this }}
          <p style="margin-block: 1em 0"><code>{{this}}</code></p>
        </li>
        {{/each}}
      </ul>
    </div>
  </hbs>`,
  data: { iconNames },
  parameters: {
    docs: {
      iframeHeight: 300,
    },
  },
});

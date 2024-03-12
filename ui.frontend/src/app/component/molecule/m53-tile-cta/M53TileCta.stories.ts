import { ArgTypes, Meta } from '@muban/storybook/dist/client/preview/types-6-0';
import { withMappedProps } from '../../../../../.storybook/helpers/mapToProps';
import { M53TileCtaProps } from './M53TileCta.types';
import M53TileCta from './M53TileCta';
import { flattenProps } from '../../../../../.storybook/helpers/flattenProps';
import { getFlatPropTypes } from '../../../../../.storybook/helpers/getFlatPropTypes';
import link from './data/link.yaml';
import button from './data/button.yaml';

const flattenedButtonExample = flattenProps<M53TileCtaProps>(button);
const flattenedLinkExample = flattenProps<M53TileCtaProps>(link);
const flattenedArgTypes = [flattenedButtonExample, flattenedLinkExample].reduce(
  (flattenedArgTypes, data) => {
    const argTypes = getFlatPropTypes(data);

    return { ...flattenedArgTypes, ...argTypes };
  },
  {} as ArgTypes,
);
export default {
  component: M53TileCta,
  title: `NEOM/molecule/M53 Tile CTA`,
  argTypes: {
    ...flattenedArgTypes,
    id: {
      control: 'text',
      description: 'ID set with ID attribute on the HTML element',
    },
    icon: {
      control: 'text',
      description: 'Icon that is displayed in the tile',
    },
    target: {
      control: 'text',
      options: 'Target attribute. Only usable when `href` is defined',
    },
  },
} as Meta;

const DefaultTemplate = () => ({
  template: `<hbs>
    <style>:root{--color-storybook-background:var(--color-black);}</style>
    {{> m53-tile-cta }}
  </hbs>`,
});

export const Button = withMappedProps<M53TileCtaProps>(DefaultTemplate);
export const Link = withMappedProps<M53TileCtaProps>(DefaultTemplate);

Button.args = flattenedButtonExample;
Link.args = flattenedLinkExample;

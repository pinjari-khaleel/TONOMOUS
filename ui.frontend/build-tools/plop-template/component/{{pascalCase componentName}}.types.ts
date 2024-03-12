{{#if (equals type 'block')}}import {NeomThemeBackgroundColors} from "../../../data/type/ComponentThemes";
import {BlockComponentPadding} from "../../../data/type/BlockComponentPadding";{{/if}}

export type {{pascalCase componentName}}Props = {
  {{#if (equals type 'block')}}backgroundColor?: NeomThemeBackgroundColors;
  padding?: BlockComponentPadding;{{/if}}
  id?: string;
  scrollComponent?: boolean;
}

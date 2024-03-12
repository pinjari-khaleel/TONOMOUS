import { A01ImageProps } from './../../atom/a01-image/A01Image.types';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';

export type C84TabbedCtaProps = {
  id?: string;
  scrollComponent?: boolean;
  padding?: BlockComponentPadding;
  header: M04ComponentHeaderProps;
  items: Array<C84tabbedCtaItem>;
};

export type C84tabbedCtaItem = {
  image: A01ImageProps;
  text: string;
  button: M02ButtonProps;
};

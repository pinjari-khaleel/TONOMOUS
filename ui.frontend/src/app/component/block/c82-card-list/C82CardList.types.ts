import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';
import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import A07LabelProps from 'app/component/atom/a07-label/A07Label.types';
import M04ComponentHeaderProps from 'app/component/molecule/m04-component-header/M04ComponentHeader.types';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';

export type C82CardListProps = {
  id?: string;
  scrollComponent?: boolean;
  padding?: BlockComponentPadding;
  heading: M04ComponentHeaderProps;
  items: Array<C82CarListItemProps>;
};

export type C82CarListItemProps = {
  label: A07LabelProps;
  text: string;
  image: A01ImageProps;
  button: M02ButtonProps;
};

import A04EyebrowProps from 'app/component/atom/a04-eyebrow/A04Eyebrow.types';
import { M02ButtonProps } from 'app/component/molecule/m02-button/M02Button.types';

export type O69AbstractListProps = {
  id?: string;
  scrollComponent?: boolean;
  items: Array<ListItem>;
  ordered?: boolean;
};

type ListItem = {
  description: string;
} & (
  | {
      heading: {
        button?: M02ButtonProps;
        eyebrow?: never;
      };
    }
  | {
      heading: {
        eyebrow?: A04EyebrowProps;
        button?: never;
      };
    }
);

import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { NeomComponentThemes } from '../../../data/type/ComponentThemes';

export type O45FormProps = {
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  titleInEnglish: string;
  variant?: string;
  action: string;
  method: 'post' | 'get';
  id: string;
  form_id: string;
  heading?: A03HeadingProps;
  description?: string;
  groups: Array<{
    legend?: string;
    items: Array<{
      type: 'checkbox' | 'email' | 'password' | 'select' | 'text' | 'textarea';
    }>;
  }>;
  buttons: Array<M02ButtonProps>;
  footer: {
    copy: string;
  };
  messages: {
    error: O45FormResponseProps;
    success: O45FormResponseProps;
  };
};

type O45FormResponseProps = {
  icon?: string;
  heading?: {
    text: string;
  };
  description?: string;
};

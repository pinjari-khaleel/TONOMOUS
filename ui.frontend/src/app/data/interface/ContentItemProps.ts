import { ContentScopeSizes } from '../type/Scopes';

export interface ContentItemProps {
  size: Omit<ContentScopeSizes, 'xlarge'>;
  content: string;
}

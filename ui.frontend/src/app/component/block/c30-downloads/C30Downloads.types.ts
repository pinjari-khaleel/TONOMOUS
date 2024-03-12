import { BlockPaddingProps } from 'app/data/type/BlockPaddings';
import M05DownloadItemProps from '../../molecule/m05-download-item/M05DownloadItem.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';

export type C30DownloadsProps = {
  scrollComponent?: boolean;
  theme?: NeomComponentThemes;
  backgroundColor?: NeomThemeBackgroundColors;
  direction?: 'column' | 'row';
  padding?: BlockPaddingProps;
  downloads: {
    title: string;
    items: Array<M05DownloadItemProps>;
  };
};

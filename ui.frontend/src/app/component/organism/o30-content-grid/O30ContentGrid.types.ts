import M16FigureProps from '../../molecule/m16-figure/M16Figure.types';
import M17ListProps from '../../molecule/m17-list/M17List.types';
import M18ParagraphProps from '../../molecule/m18-paragraph/M18Paragraph.types';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import { Alignment } from '../../../data/interface/Alignment';
import { BlockPaddingProps } from '../../../data/type/BlockPaddings';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { M34ComponentBackgroundProps } from 'app/component/molecule/m34-component-background/M34ComponentBackground.types';
import { NeomComponentThemes, NeomThemeBackgroundColors } from '../../../data/type/ComponentThemes';
import { M58PillarCtaProps } from 'app/component/molecule/m58-pillar-cta/M58PillarCta.types';

type O30ContentGridLayout =
  | 'fullWidth'
  | 'single'
  | 'double'
  | 'double-2-1'
  | 'double-1-2'
  | 'triple'
  | 'triple-2-1-1'
  | 'triple-1-2-1'
  | 'triple-1-1-2'
  | 'quadruple';

type O30ContentGridWidth = 'full' | 'medium' | 'small'; // default is 'small'

type O30ContentGridTypes = 'list' | 'paragraph' | 'asset';

export type O30ContentGridItem = {
  align: Alignment;
  buttons: Array<M02ButtonProps | M58PillarCtaProps>;
  content: M16FigureProps | M17ListProps | M18ParagraphProps | A19VideoProps;
  type: O30ContentGridTypes;
  buttonType?: 'default' | 'pillar';
};

export type O30ContentGridProps = {
  theme?: NeomComponentThemes;
  background?: M34ComponentBackgroundProps;
  items: Array<O30ContentGridItem>;
  padding?: BlockPaddingProps;
  backgroundColor?: NeomThemeBackgroundColors;
  scrollComponent: boolean;
  variant?: O30ContentGridLayout;
  contentWidth?: O30ContentGridWidth;
};

export default O30ContentGridProps;

import { Alignment } from 'app/data/interface/Alignment';
import { O60HeroContentProps } from './../../organism/o60-hero-content/O60HeroContent.types';
import { M34ComponentBackgroundProps } from 'app/component/molecule/m34-component-background/M34ComponentBackground.types';
import { BlockComponentPadding } from '../../../data/type/BlockComponentPadding';

export type C79WebglEffectHeroProps = {
  id?: string;
  scrollComponent?: boolean;
  padding?: BlockComponentPadding;
  background: M34ComponentBackgroundProps;
  align: Alignment;
  content: O60HeroContentProps;
};

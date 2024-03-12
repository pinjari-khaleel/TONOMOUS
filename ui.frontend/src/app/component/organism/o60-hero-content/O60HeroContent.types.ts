import { Alignment } from '../../../data/interface/Alignment';
import { M34ComponentBackgroundProps } from '../../molecule/m34-component-background/M34ComponentBackground.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';
import { M02ButtonProps } from '../../molecule/m02-button/M02Button.types';
import { A01ImageDirection } from '../../atom/a01-image/A01Image.types';
import { M53TileCtaProps } from '../../molecule/m53-tile-cta/M53TileCta.types';
import M06LinkProps from '../../molecule/m06-link/M06Link.types';
import { M58PillarCtaProps } from 'app/component/molecule/m58-pillar-cta/M58PillarCta.types';

export type O60HeroContentProps = {
  align: Alignment;
  background: M34ComponentBackgroundProps;
  content: {
    link?: M06LinkProps;
    header: M04ComponentHeaderProps;
  } & (
    | {
        buttons: Array<M02ButtonProps>;
        buttonType: 'regular';
        buttonEyebrow?: never;
      }
    | {
        buttons: Array<M53TileCtaProps>;
        buttonType: 'tile';
        buttonEyebrow?: string;
      }
    | {
        buttons: Array<M58PillarCtaProps>;
        buttonType: 'pillar';
        buttonEyebrow?: never;
      }
    | {
        buttons?: never;
        buttonType?: never;
        buttonEyebrow?: never;
      }
  );
  scrollButton?: boolean;
  scrollComponent?: boolean;
  transitionDirection?: A01ImageDirection;
};

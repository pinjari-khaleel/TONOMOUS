import A01ImageProps, { A01ImageDirection } from '../../atom/a01-image/A01Image.types';
import A20LottieAnimation from '../../atom/a20-lottie-animation/A20LottieAnimation';
import { A19VideoProps } from '../../atom/a19-video/A19Video.types';
import { EffectType } from '../../../effects/ImageEffect';

export type M34ComponentBackgroundProps = {
  mask?: {
    opacity: 0 | 0.25 | 0.5 | 0.75; // 0.5 is default
    solid?: boolean;
  };
  disableTransition?: boolean;
  scrollComponent?: boolean;
  sticky?: boolean;
  image: A01ImageProps;
  transitionDirection?: A01ImageDirection;
} & (
  | {
      video: A19VideoProps;
      lottie?: never;
      effect?: never;
    }
  | {
      lottie: A20LottieAnimation;
      video?: never;
      effect?: never;
    }
  | {
      effect: EffectType;
      lottie?: never;
      video?: never;
    }
);

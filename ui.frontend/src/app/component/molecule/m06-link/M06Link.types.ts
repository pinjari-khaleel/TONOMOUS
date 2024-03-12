import A07LabelProps from '../../atom/a07-label/A07Label.types';
import A07LabelVariants from '../../atom/a07-label/A07Label.types';

export type M06LinkTargets = '_blank' | '_self';

export type M06LinkProps = {
  label: A07LabelProps;
  href?: string;
  target?: M06LinkTargets;
  variant?: A07LabelVariants;
  icon?: string;
};

export default M06LinkProps;

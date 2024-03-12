import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import A04EyebrowProps from '../../atom/a04-eyebrow/A04Eyebrow.types';
import A05MoustacheProps from '../../atom/a05-moustache/A05Moustache.types';
import A06FlipHeadingProps from '../../atom/a06-flip-heading/A06FlipHeading.types';
import { HorizontalAlignmentTypes } from '../../../data/interface/Alignment';

type M04ComponentHeaderAlignments = HorizontalAlignmentTypes | 'none'; // center default when undefined;

interface M04ComponentHeaderBase {
  alignment?: M04ComponentHeaderAlignments;
  disableTransition?: boolean;
  eyebrow?: A04EyebrowProps;
  moustache?: A05MoustacheProps;
  variant?: string;
}

interface M04ComponentHeaderStatic extends M04ComponentHeaderBase {
  heading?: A03HeadingProps;
}

interface M04ComponentHeaderAnimated extends M04ComponentHeaderBase {
  flipHeading?: A06FlipHeadingProps;
}

type M04ComponentHeaderProps = M04ComponentHeaderAnimated | M04ComponentHeaderStatic;

export default M04ComponentHeaderProps;

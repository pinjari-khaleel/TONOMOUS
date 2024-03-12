import { A03HeadingElements, A03HeadingSizes } from '../a03-heading/A03Heading.types';

type A06FlipHeadingProps = {
  element: A03HeadingElements;
  size?: A03HeadingSizes;
  labels: Array<string>;
  prefix: string;
};

export default A06FlipHeadingProps;

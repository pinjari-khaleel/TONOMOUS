export type A03HeadingSizes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type A03HeadingElements =
  | 'h1'
  | 'h2' // default when undefined;
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6';

type A03HeadingProps = {
  element: A03HeadingElements;
  size?: A03HeadingSizes;
  text: string;
};

export default A03HeadingProps;

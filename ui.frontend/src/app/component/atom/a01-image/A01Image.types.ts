export type A01ImageDirection = 0 | 1 | 2 | 3;

export type A01ImageProps = {
  alt: string;
  direction?: A01ImageDirection;
  disableTransition?: boolean; // defaults to true when undefined
  loading?: 'lazy' | 'eager' | 'auto'; // defaults to 'lazy'
  poster?: boolean; // defaults to false when undefined
  scrollComponent?: boolean; // defaults to false when undefined
  sources: Array<A01ImageSource>;
  src: string;
  variant?: 'contain' | 'block';
};

interface A01ImageSource {
  media?: string;
  src: string;
  sizes?: string;
  type?: string;
}

export default A01ImageProps;

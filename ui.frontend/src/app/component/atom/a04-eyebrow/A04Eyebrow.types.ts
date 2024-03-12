export type A04EyebrowSizes = 'small' | 'medium' | 'large'; // large default when undefined

type A04EyebrowProps = {
  size: A04EyebrowSizes;
  text: string;
  variant?: string; // not user-facing
};

export default A04EyebrowProps;

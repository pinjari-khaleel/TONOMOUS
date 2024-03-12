export type A05MoustacheSizes = 'small' | 'large'; // 'large' default when undefined

type A05MoustacheProps = {
  size: A05MoustacheSizes;
  text: string;
  variant?: string; // not user-facing
};

export default A05MoustacheProps;

export type A07LabelSizes = 'small';
export type A07LabelVariants = 'footerLink' | 'marginaliaLink' | 'checkbox';

type A07LabelProps = {
  size?: A07LabelSizes;
  variant?: A07LabelVariants;
  text: string;
};

export default A07LabelProps;

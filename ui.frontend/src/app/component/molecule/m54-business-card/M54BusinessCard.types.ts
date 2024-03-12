import A01ImageProps from '../../atom/a01-image/A01Image.types';

export type M54BusinessCardProps = {
  id?: string;
  scrollComponent?: boolean;
  image: A01ImageProps;
  name: string;
  linkedin?: string;
  job: {
    title: string;
    department: string;
  };
  biography?: string;
};

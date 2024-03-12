import A01ImageProps from 'app/component/atom/a01-image/A01Image.types';
import M12SocialProps from 'app/component/molecule/m12-social/M12Social.types';

export type O70ModalBioContentProps = {
  id?: string;
  scrollComponent?: boolean;
  image: A01ImageProps;
  name: string;
  role: string;
  sector?: string;
  region?: string;
  social?: M12SocialProps;
  copy?: string;
  backButtonLabel?: string;
};

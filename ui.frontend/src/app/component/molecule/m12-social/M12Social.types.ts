import { AnchorTargets } from '../../../data/type/AnchorTargets';

export type M12SocialIcons =
  | 'facebook-gold'
  | 'instagram-gold'
  | 'linkedin-gold'
  | 'tiktok-gold'
  | 'twitter-gold'
  | 'youtube-gold'
  | 'snapchat-gold';

type M12SocialProps = {
  items: Array<{
    href: string;
    icon: M12SocialIcons;
    label?: string;
    target?: AnchorTargets;
    title?: string;
  }>;
};

export default M12SocialProps;

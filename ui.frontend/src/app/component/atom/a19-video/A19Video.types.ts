export type A19VideoProps = {
  autoloop: boolean;
  props: {
    autoplay: boolean;
    crossorigin?: 'anonymous' | 'use-credentials';
    loop: boolean;
    muted: boolean;
    playsinline: boolean;
    poster?: string;
    src: string;
    type: string;
    sources: Array<{
      src: string;
      type: string;
      media?: string;
    }>;
  };
};

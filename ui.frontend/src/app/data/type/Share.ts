export type ShareProps = {
  title: string;
  description: string;
  locale?: string;
  type: 'article' | 'website' | 'video.movie' | 'profile'; // currently only 'article'
  url: string; // full url -no params
  image: {
    alt?: string;
    src: string; // full url, 1200x650
  };
  twitter?: {
    card: 'summary' | 'summary_large_image' | 'app' | 'player'; // currently only 'summary' or 'summary_large_image'
    alt?: string;
    creator?: string;
    description?: string;
    image?: {
      alt?: string;
      src: string; // summary is square, summary_large_image is 2:1
    };
    site: string;
    title?: string;
  };
};

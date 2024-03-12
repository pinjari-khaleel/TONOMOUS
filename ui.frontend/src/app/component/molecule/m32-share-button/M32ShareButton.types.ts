export type M32ShareButtonProps = {
  href: string;
  id: string;
  label: string;
  icon?: string;
  eventTracking: {
    event: string;
    article: {
      author: string;
      publishedDate: string;
      title: string;
      titleInEnglish: string;
      shareMethod: string;
    };
  };
};

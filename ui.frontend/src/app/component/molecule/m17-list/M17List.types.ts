import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';

type M17ListContentSizes = 'small' | 'medium' | 'large';

interface M17ListDefinitionItem {
  copy: string;
  title: string;
}

interface M17ListDefaultProps {
  ordered?: boolean;
  size?: M17ListContentSizes;
  header?: {
    heading?: A03HeadingProps;
    copy?: {
      size?: M17ListContentSizes;
      content: string;
    };
  };
}

interface M17ListDefinitionList extends M17ListDefaultProps {
  variant: 'definitions';
  items: ReadonlyArray<M17ListDefinitionItem>;
}

interface M17ListDefaultList extends M17ListDefaultProps {
  items: ReadonlyArray<string>;
}

type M17ListProps = M17ListDefinitionList | M17ListDefaultList;

export default M17ListProps;

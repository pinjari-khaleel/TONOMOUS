import A03HeadingProps from '../../atom/a03-heading/A03Heading.types';
import { ContentItemProps } from 'app/data/interface/ContentItemProps';
import O05AccordionProps from '../../organism/o05-accordion/O05Accordion.types';

export type C37LegalContentProps = {
  heading: A03HeadingProps;
  items: Array<ContentItemProps>;
  accordion?: O05AccordionProps;
};

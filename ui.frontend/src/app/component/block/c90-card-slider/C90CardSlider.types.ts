import { O84EventCardProps } from 'app/component/organism/o84-event-card/O84EventCard.types';
import { O85NewsCardProps } from 'app/component/organism/o85-news-card/O85NewsCard.types';
import M04ComponentHeaderProps from '../../molecule/m04-component-header/M04ComponentHeader.types';

export type C90CardSliderProps = {
  header: M04ComponentHeaderProps;
  items: Array<O85NewsCardProps | O84EventCardProps>;
  scrollComponent: boolean;
};

import M14ToggleButtonProps from '../../molecule/m14-toggle-button/M14ToggleButton.types';
import { AccordionClickTrackingEvent } from '../../../util/TrackingEvent';

export type O06CollapsibleItemProps = {
  label: M14ToggleButtonProps;
  content: string;
  eventTracking?: AccordionClickTrackingEvent;
};

export default O06CollapsibleItemProps;

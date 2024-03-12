import ko, { Observable } from 'knockout';

export const isRoyalAnnouncementHours = () => {
  let switchHourDate: any = new Date('01/11/2021 07:00 UTC').getTime();
  let currentDate: any = new Date().getTime();
  const distance = switchHourDate - currentDate;

  return distance > 0;
};

const getInitialState = () => {
  if (isRoyalAnnouncementHours()) {
    return HeaderState.ROYAL_ANNOUNCEMENT;
  }
  return HeaderState.HERO;
};

class HeaderSwitcher {
  public activeState: Observable<HeaderState> = ko.observable(getInitialState());

  public set state(state: HeaderState) {
    this.activeState(state);
  }
}

export enum HeaderState {
  ROYAL_ANNOUNCEMENT,
  HERO,
}

export const headerSwitcher = new HeaderSwitcher();

export interface Alignment {
  horizontal?: HorizontalAlignmentTypes;
  vertical?: VerticalAlignmentTypes;
}

export enum HorizontalAlignmentTypes {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export enum VerticalAlignmentTypes {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

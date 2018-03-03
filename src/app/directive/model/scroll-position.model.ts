export const scrollUpAction = 'SCROLL_UP_ACTION';
export const scrollDownAction = 'SCROLL_DOWN_ACTION';

export interface ScrollPosition {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
}

export interface ScrollPositionsUp {
  type: typeof scrollUpAction;
  scrollPositions: ScrollPosition[];
}

export interface ScrollPositionsDown {
  type: typeof scrollDownAction;
  scrollPositions: ScrollPosition[];
}

export const initialScrollPosition: ScrollPosition = {
  scrollHeight: 0,
  scrollTop: 0,
  clientHeight: 0
}

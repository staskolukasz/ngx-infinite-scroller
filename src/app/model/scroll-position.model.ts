export const scrollUpAction = 'SCROLL_UP_ACTION';
export const scrollDownAction = 'SCROLL_DOWN_ACTION';

export interface ScrollPosition {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
}

export const initialScrollPosition: ScrollPosition = {
  scrollHeight: 0,
  scrollTop: 0,
  clientHeight: 0
}

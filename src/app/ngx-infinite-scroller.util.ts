import { ScrollPosition } from './model/scroll-position.model';

export class NgxInfiniteScrollerUtil {
  public static wasScrolledDown(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return prevPos.scrollTop < currentPos.scrollTop;
  }

  public static isScrollDownEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return ((pos.scrollTop + pos.clientHeight) / pos.scrollHeight) > (scrollPositionTrigger / 100);
  }
}
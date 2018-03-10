import { ScrollPosition } from '../model/scroll-position.model';

export class Utils {
  public static wasScrolledDown(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return prevPos.scrollTop < currentPos.scrollTop;
  }

  public static wasScrolledUp(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return !Utils.wasScrolledDown(prevPos, currentPos);
  }

  public static isScrollDownEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return ((pos.scrollTop + pos.clientHeight) / pos.scrollHeight) > (scrollPositionTrigger / 100);
  }

  public static isScrollUpEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return (pos.scrollTop / pos.scrollHeight) < (scrollPositionTrigger / 100);
  }
}

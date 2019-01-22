import { ScrollPosition } from '../model/scroll-position.model';

export abstract class StrategyHelper {
  protected wasScrolledDown(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return prevPos.scrollTop < currentPos.scrollTop;
  }

  protected wasScrolledUp(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return !this.wasScrolledDown(prevPos, currentPos);
  }

  protected isScrollDownEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return ((pos.scrollTop + pos.clientHeight) / pos.scrollHeight) > (scrollPositionTrigger / 100);
  }

  protected isScrollUpEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return (pos.scrollTop / pos.scrollHeight) < (scrollPositionTrigger / 100);
  }
}

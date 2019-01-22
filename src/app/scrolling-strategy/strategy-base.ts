import * as isNumber from 'is-number';

import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { ScrollPosition } from '../model/scroll-position.model';
import { InitialScrollPosition } from '../enum/initial-scroll-position-type.enum';

export abstract class StrategyBase {
  constructor(
    protected directive: NgxInfiniteScrollerDirective,
    protected state: DirectiveStateService
  ) { }

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

  protected getInitialScrollPositionValue(defaultScrollPosition: InitialScrollPosition): number {
    const { initialScrollPosition } = this.directive;

    if (isNumber(initialScrollPosition)) {
      return Number(initialScrollPosition);
    }

    const initialScrollPositions: { [key: string]: number } = this.getInitialScrollPositions();

    if (initialScrollPosition === InitialScrollPosition.DEFAULT) {
      return initialScrollPositions[defaultScrollPosition];
    }

    return initialScrollPositions[initialScrollPosition];
  }

  private getInitialScrollPositions(): { [key: string]: number } {
    const { scrollHeight, clientHeight } = this.state;

    return {
      [InitialScrollPosition.TOP]: 0,
      [InitialScrollPosition.MIDDLE]: scrollHeight / 2 - clientHeight / 2,
      [InitialScrollPosition.BOTTOM]: scrollHeight,
    };
  }
}

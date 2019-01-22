import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { StrategyHelper } from './strategy-helper';

import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { ScrollingStrategy } from '../model/scrolling-strategy.model';
import { ScrollPosition } from '../model/scroll-position.model';

export class ScrollingToBottom extends StrategyHelper implements ScrollingStrategy {

  constructor(
    private directive: NgxInfiniteScrollerDirective,
    private state: DirectiveStateService
  ) {
    super();
  }

  public scrollDirectionChanged(scrollPairChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPairChanged.pipe(
      filter((scrollPositions: ScrollPosition[]) => {
        return super.wasScrolledDown(
          scrollPositions[0],
          scrollPositions[1]
        );
      })
    );
  }

  public scrollRequestZoneChanged(scrollDirectionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollDirectionChanged.pipe(
      filter((scrollPositions: ScrollPosition[]) => {
        return super.isScrollDownEnough(
          scrollPositions[1],
          this.directive.scrollDownPercentilePositionTrigger
        );
      })
    );
  }

  public askForUpdate(): void {
    this.directive.onScrollDown.next();
  }

  public setInitialScrollPosition(): void {
    this.directive.scrollTo(0);
  }

  public setPreviousScrollPosition(): void {
    const prevScrollPosition = this.state.previousScrollTop;
    this.directive.scrollTo(prevScrollPosition);
  }
}

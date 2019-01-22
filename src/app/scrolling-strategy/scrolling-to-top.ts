import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { StrategyHelper } from './strategy-helper';

import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { ScrollingStrategy } from '../model/scrolling-strategy.model';
import { ScrollPosition } from '../model/scroll-position.model';

export class ScrollingToTop extends StrategyHelper implements ScrollingStrategy {

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
        return super.wasScrolledUp(
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
        return super.isScrollUpEnough(
          scrollPositions[1],
          this.directive.scrollUpPercentilePositionTrigger
        );
      })
    );
  }

  public askForUpdate(): void {
    this.directive.onScrollUp.next();
  }

  public setInitialScrollPosition(): void {
    this.directive.scrollTo(this.state.scrollHeight);
  }

  public setPreviousScrollPosition(): void {
    const prevScrollPosition = this.state.previousScrollTop +
      (this.state.scrollHeight - this.state.previousScrollHeight);
    this.directive.scrollTo(prevScrollPosition);
  }
}

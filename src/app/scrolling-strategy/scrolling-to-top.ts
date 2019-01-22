import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { StrategyBase } from './strategy-base';

import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { ScrollingStrategy } from '../model/scrolling-strategy.model';
import { ScrollPosition } from '../model/scroll-position.model';
import { InitialScrollPosition } from '../enum/initial-scroll-position-type.enum';

export class ScrollingToTop extends StrategyBase implements ScrollingStrategy {

  constructor(
    directive: NgxInfiniteScrollerDirective,
    state: DirectiveStateService
  ) {
    super(directive, state);
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
    const initialScrollPositionValue = super.getInitialScrollPositionValue(
      InitialScrollPosition.BOTTOM,
    );

    this.directive.scrollTo(initialScrollPositionValue);
  }

  public setPreviousScrollPosition(): void {
    const prevScrollPosition = this.state.previousScrollTop +
      (this.state.scrollHeight - this.state.previousScrollHeight);
    this.directive.scrollTo(prevScrollPosition);
  }
}

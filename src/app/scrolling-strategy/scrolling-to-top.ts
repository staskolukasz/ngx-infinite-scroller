import { Observable } from 'rxjs/Observable';
import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { Utils } from './utils';
import { ScrollingStrategy } from '../model/scrolling-strategy.model';
import { ScrollPosition } from '../model/scroll-position.model';

export class ScrollingToTop implements ScrollingStrategy {

  constructor(
    private directive: NgxInfiniteScrollerDirective,
    private state: DirectiveStateService
  ) { }

  public scrollDirectionChanged(scrollPairChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPairChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return Utils.wasScrolledUp(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  public scrollRequestZoneChanged(scrollDirectionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollDirectionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return Utils.isScrollUpEnough(
          scrollPositions[1],
          this.directive.scrollUpPercentilePositionTrigger
        );
      });
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

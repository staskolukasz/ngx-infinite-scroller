import { Observable } from 'rxjs/Observable';
import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { Utils } from './utils';
import { ScrollingStrategy } from '../model/scrolling-strategy.model';
import { ScrollPosition } from '../model/scroll-position.model';

export class ScrollingToBoth implements ScrollingStrategy {

  private scrolledUp: boolean;

  constructor(
    private directive: NgxInfiniteScrollerDirective,
    private state: DirectiveStateService
  ) { }

  public scrollDirectionChanged(scrollPairChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPairChanged;
  }

  public scrollRequestZoneChanged(scrollDirectionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollDirectionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return (Utils.isScrollUpEnough(
          scrollPositions[1],
          this.directive.scrollUpPercentilePositionTrigger
        ) || Utils.isScrollDownEnough(
          scrollPositions[1],
          this.directive.scrollDownPercentilePositionTrigger
        ));
      })
      .do((scrollPositions: ScrollPosition[]) => {
        this.scrolledUp = Utils.wasScrolledUp(
          scrollPositions[0],
          scrollPositions[1]);
      });
  }

  public askForUpdate(): void {
    if (this.scrolledUp) {
      this.directive.onScrollUp.next();
    } else {
      this.directive.onScrollDown.next();
    }
  }

  public setInitialScrollPosition(): void {
    this.directive.scrollTo(this.state.scrollHeight / 2 - this.state.clientHeight / 2);
  }

  public setPreviousScrollPosition(): void {
    let prevScrollPosition;

    if (this.scrolledUp) {
      prevScrollPosition = this.state.previousScrollTop +
        (this.state.scrollHeight - this.state.previousScrollHeight);
    } else {
      prevScrollPosition = this.state.previousScrollTop;
    }

    this.directive.scrollTo(prevScrollPosition);
  }
}

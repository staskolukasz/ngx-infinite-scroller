import { Observable } from 'rxjs/Observable';
import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { Utils } from './utils';
import { ScrollingStrategy } from '../model/scrolling-strategy.model';
import { ScrollPosition } from '../model/scroll-position.model';

export class ScrollingToBottom implements ScrollingStrategy {

  constructor(
    private directive: NgxInfiniteScrollerDirective,
    private state: DirectiveStateService
  ) { }

  public scrollDirectionChanged(scrollPairChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPairChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return Utils.wasScrolledDown(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  public scrollRequestZoneChanged(scrollDirectionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollDirectionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return Utils.isScrollDownEnough(
          scrollPositions[1],
          this.directive.scrollDownPercentilePositionTrigger
        );
      });
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

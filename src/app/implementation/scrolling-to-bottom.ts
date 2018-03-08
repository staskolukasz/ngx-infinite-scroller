import { Observable } from 'rxjs/Observable';
import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';

import { Utils } from './utils';
import { ScrollingStrategy } from './scrolling-strategy';
import { ScrollPosition } from './../model/scroll-position.model';

export class ScrollingToBottom implements ScrollingStrategy {

  private directive: NgxInfiniteScrollerDirective;

  constructor(directive: NgxInfiniteScrollerDirective) {
    this.directive = directive;
  }

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

  public setInitialScrollPosition(): void {
    this.directive.scrollTo(0);
  }

  public setPreviousScrollPosition(): void {
    const prevScrollPosition = this.directive.previousScrollTop;
    this.directive.scrollTo(prevScrollPosition);
  }

  public scrollRequest(): void {
    this.directive.onScrollDown.next();
  }
}

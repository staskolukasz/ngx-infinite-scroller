import { Observable } from 'rxjs/Observable';
import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';

import { Utils } from './utils';
import { ScrollingStrategy } from './scrolling-strategy';
import { ScrollPosition } from './../model/scroll-position.model';

export class ScrollingToBoth implements ScrollingStrategy {

  private directive: NgxInfiniteScrollerDirective;

  private scrolledUp: boolean;

  constructor(directive: NgxInfiniteScrollerDirective) {
    this.directive = directive;
  }

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
      });;
  }

  public askForUpdate(): void {
    if (this.scrolledUp) {
      this.directive.onScrollUp.next();
    } else {
      this.directive.onScrollDown.next();
    }
  }

  public setInitialScrollPosition(): void {
    this.directive.scrollTo(this.directive.el.nativeElement.scrollHeight / 2 - this.directive.el.nativeElement.clientHeight / 2);
  }

  public setPreviousScrollPosition(): void {
    let prevScrollPosition;

    if (this.scrolledUp) {
      prevScrollPosition = this.directive.previousScrollTop +
        (this.directive.el.nativeElement.scrollHeight - this.directive.previousScrollHeight);
    } else {
      prevScrollPosition = this.directive.previousScrollTop;
    }

    this.directive.scrollTo(prevScrollPosition);
  }
}

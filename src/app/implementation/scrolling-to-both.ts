import { Observable } from 'rxjs/Observable';
import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';

import { ScrollingStrategy } from './scrolling-strategy';
import { ScrollPosition, initialScrollPosition } from './../model/scroll-position.model';

export class ScrollingToBoth implements ScrollingStrategy {

  private directive: NgxInfiniteScrollerDirective;

  constructor(directive: NgxInfiniteScrollerDirective) {
    this.directive = directive;
  }

  public scrollDirectionChanged(scrollPairChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPairChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.wasScrolledUp(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  public scrollRequestZoneChanged(scrollDirectionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollDirectionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.isScrollUpEnough(
          scrollPositions[1],
          this.directive.scrollUpPercentilePositionTrigger
        );
      });
  }

  public setInitialScrollPosition(): void {
    this.directive.scrollTo(this.directive.el.nativeElement.scrollHeight);
  }

  public setPreviousScrollPosition(): void {
    const newScrollPosition = this.directive.previousScrollTop +
      (this.directive.el.nativeElement.scrollHeight - this.directive.previousScrollHeight);
    this.directive.scrollTo(newScrollPosition);
  }

  public scrollRequest(): void {
    this.directive.onScrollUp.next();
  }

  private wasScrolledUp(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return prevPos.scrollTop > currentPos.scrollTop;
  }

  private isScrollUpEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return (pos.scrollTop / pos.scrollHeight) < (scrollPositionTrigger / 100);
  }
}

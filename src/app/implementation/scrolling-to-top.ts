import { ScrollingStrategy } from "./scrolling-strategy";
import { Observable } from "rxjs/Observable";
import { ScrollPosition, initialScrollPosition } from "./../model/scroll-position.model";
import { NgxInfiniteScrollerDirective } from "../ngx-infinite-scroller.directive";

export class ScrollingToTop implements ScrollingStrategy {

  private directive: NgxInfiniteScrollerDirective;

  constructor(directive: NgxInfiniteScrollerDirective) {
    this.directive = directive;
  }

  public scrollDirectionChanged(scrollPositionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPositionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.wasScrolledUp(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  public scrollRequestZoneChanged(scrollTypeChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollTypeChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.isScrollUpEnough(
          scrollPositions[1],
          this.directive.scrollUpPercentilePositionTrigger
        );
      })
  }

  public scrollRequestChanged(scrollRequestZoneEntered: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollRequestZoneEntered
      .do(() => {
        this.directive.previousScrollTop = this.directive.el.nativeElement.scrollTop;
        this.directive.previousScrollHeight = this.directive.el.nativeElement.scrollHeight;
      })
      .startWith([initialScrollPosition, initialScrollPosition]);
  }

  public setInitialScrollPosition(): void {
    this.directive.scrollTo(this.directive.el.nativeElement.scrollHeight)
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

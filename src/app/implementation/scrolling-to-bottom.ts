import { ScrollingStrategy } from "./scrolling-strategy";
import { Observable } from "rxjs/Observable";
import { ScrollPosition, initialScrollPosition } from "./../model/scroll-position.model";
import { NgxInfiniteScrollerDirective } from "../ngx-infinite-scroller.directive";

export class ScrollingToBottom implements ScrollingStrategy {

  private directive: NgxInfiniteScrollerDirective;

  constructor(directive: NgxInfiniteScrollerDirective) {
    this.directive = directive;
  }

  public scrollDirectionChanged(scrollPositionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPositionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.wasScrolledDown(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  public scrollRequestZoneChanged(scrollTypeChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollTypeChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.isScrollDownEnough(
          scrollPositions[1],
          this.directive.scrollDownPercentilePositionTrigger
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
    this.directive.scrollTo(0)
  }

  public setPreviousScrollPosition(): void {
    const newScrollPosition = this.directive.previousScrollTop;
    this.directive.scrollTo(newScrollPosition);
  }

  public scrollRequest(): void {
    this.directive.onScrollDown.next();
  }

  private wasScrolledDown(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return prevPos.scrollTop < currentPos.scrollTop;
  }

  private isScrollDownEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return ((pos.scrollTop + pos.clientHeight) / pos.scrollHeight) > (scrollPositionTrigger / 100);
  }
}
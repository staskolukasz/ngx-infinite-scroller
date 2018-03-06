import { ScrollingStrategy } from "./scrolling-strategy";
import { Observable } from "rxjs/Observable";
import { ScrollPosition, initialScrollPosition } from "./../model/scroll-position.model";
import { NgxInfiniteScrollerDirective } from "../ngx-infinite-scroller.directive";
import { NgxInfiniteScrollerUtil } from "../ngx-infinite-scroller.util";

export class ScrollingTop implements ScrollingStrategy {

  private directive: NgxInfiniteScrollerDirective;

  constructor(directive: NgxInfiniteScrollerDirective) {
    this.directive = directive;
  }

  public scrollPositionChanged(scrollChanged: Observable<Event>): Observable<ScrollPosition[]> {
    return scrollChanged
      .takeWhile(() => this.directive.scrollStreamActive)
      .map((e: any) => {
        return <ScrollPosition>{
          scrollHeight: e.target.scrollHeight,
          scrollTop: e.target.scrollTop,
          clientHeight: e.target.clientHeight,
        }
      })
      .pairwise()
      .debounceTime(this.directive.scrollbarAnimationInterval)
  }

  public scrollTypeChanged(scrollPositionChanged: Observable<ScrollPosition[]>): Observable<ScrollPosition[]> {
    return scrollPositionChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.wasScrolledUp(
          scrollPositions[0],
          scrollPositions[1]
        );
      });
  }

  public scrollRequestZoneEntered(scrollTypeChanged: Observable<ScrollPosition[]>): Observable<ScrollPosition[]> {
    return scrollTypeChanged
      .filter((scrollPositions: ScrollPosition[]) => {
        return this.isScrollUpEnough(
          scrollPositions[0],
          this.directive.scrollUpPercentilePositionTrigger
        );
      })
  }

  public requestDispatcher(scrollRequestZoneEntered: Observable<ScrollPosition[]>): Observable<ScrollPosition[]> {
    return scrollRequestZoneEntered
      .do(() => {
        this.directive.previousScrollTop = this.directive.el.nativeElement.scrollTop;
        this.directive.previousScrollHeight = this.directive.el.nativeElement.scrollHeight;
      })
      .startWith([initialScrollPosition, initialScrollPosition]);
  }

  public scrollTo(position?: number): void {
    this.directive.scrollStreamActive = false;
    this.directive.renderer.setProperty(
      this.directive.el.nativeElement,
      'scrollTop',
      position || this.directive.el.nativeElement.scrollHeight
    );
    this.directive.scrollStreamActive = true;
  }

  public setNewScrollPosition(): void {
    const newScrollPosition = this.directive.previousScrollTop +
      (this.directive.el.nativeElement.scrollHeight - this.directive.previousScrollHeight);
    this.scrollTo(newScrollPosition);
  }

  public onScroll(): void {
    this.directive.onScrollUp.next();
  }

  private wasScrolledUp(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean {
    return prevPos.scrollTop > currentPos.scrollTop;
  }

  private isScrollUpEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean {
    return (pos.scrollTop / pos.scrollHeight) < (scrollPositionTrigger / 100);
  }
}

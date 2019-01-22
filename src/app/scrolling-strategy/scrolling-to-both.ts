import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

import { StrategyBase } from './strategy-base';

import { NgxInfiniteScrollerDirective } from '../ngx-infinite-scroller.directive';
import { DirectiveStateService } from '../directive-state.service';

import { ScrollingStrategy } from '../model/scrolling-strategy.model';
import { ScrollPosition } from '../model/scroll-position.model';
import { InitialScrollPosition } from '../enum/initial-scroll-position-type.enum';

export class ScrollingToBoth extends StrategyBase implements ScrollingStrategy {

  private scrolledUp: boolean;

  constructor(
    directive: NgxInfiniteScrollerDirective,
    state: DirectiveStateService
  ) {
    super(directive, state);
  }

  public scrollDirectionChanged(scrollPairChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollPairChanged;
  }

  public scrollRequestZoneChanged(scrollDirectionChanged: Observable<ScrollPosition[]>):
    Observable<ScrollPosition[]> {
    return scrollDirectionChanged.pipe(
      filter((scrollPositions: ScrollPosition[]) => {
        return (super.isScrollUpEnough(
          scrollPositions[1],
          this.directive.scrollUpPercentilePositionTrigger
        ) || super.isScrollDownEnough(
          scrollPositions[1],
          this.directive.scrollDownPercentilePositionTrigger
        ));
      }),
      tap((scrollPositions: ScrollPosition[]) => {
        this.scrolledUp = super.wasScrolledUp(
          scrollPositions[0],
          scrollPositions[1]);
      })
    );
  }

  public askForUpdate(): void {
    if (this.scrolledUp) {
      this.directive.onScrollUp.next();
    } else {
      this.directive.onScrollDown.next();
    }
  }

  public setInitialScrollPosition(): void {
    const initialScrollPositionValue = super.getInitialScrollPositionValue(
      InitialScrollPosition.MIDDLE,
    );

    this.directive.scrollTo(initialScrollPositionValue);
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

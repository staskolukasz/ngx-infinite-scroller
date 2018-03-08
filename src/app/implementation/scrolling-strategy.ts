import { Observable } from 'rxjs/Observable';
import { ScrollPosition } from './../model/scroll-position.model';

export interface ScrollingStrategy {
  scrollDirectionChanged(
    scrollPairChanged: Observable<ScrollPosition[]>
  ): Observable<ScrollPosition[]>;

  scrollRequestZoneChanged(
    scrollDirectionChanged: Observable<ScrollPosition[]>
  ): Observable<ScrollPosition[]>;

  setInitialScrollPosition(): void;

  setPreviousScrollPosition(): void;

  scrollRequest(): void;
}

import { Observable } from 'rxjs/Observable';
import { ScrollPosition } from './../model/scroll-position.model';

export interface ScrollingStrategy {
  scrollDirectionChanged(scrollPositionChanged: Observable<ScrollPosition[]>): Observable<ScrollPosition[]>;
  scrollRequestZoneChanged(scrollTypeChanged: Observable<ScrollPosition[]>): Observable<ScrollPosition[]>;
  scrollRequestChanged(scrollRequestZoneEntered: Observable<ScrollPosition[]>): Observable<ScrollPosition[]>;
  setInitialScrollPosition(): void;
  setPreviousScrollPosition(): void;
  scrollRequest(): void;
}

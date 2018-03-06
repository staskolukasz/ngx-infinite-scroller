import { Observable } from 'rxjs/Observable';
import { ScrollPosition } from './../model/scroll-position.model';

export interface ScrollingStrategy {
  scrollPositionChanged(scrollChanged: Observable<Event>): Observable<ScrollPosition[]>;
  scrollTypeChanged(scrollPositionChanged: Observable<ScrollPosition[]>): Observable<ScrollPosition[]>;
  scrollRequestZoneEntered(scrollTypeChanged: Observable<ScrollPosition[]>): Observable<ScrollPosition[]>;
  requestDispatcher(scrollRequestZoneEntered: Observable<ScrollPosition[]>): Observable<ScrollPosition[]>;
  scrollTo(position?: number): void;
  setNewScrollPosition(): void;
  onScroll(): void;
}
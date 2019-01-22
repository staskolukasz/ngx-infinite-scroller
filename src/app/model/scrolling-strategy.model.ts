import { Observable } from 'rxjs';
import { ScrollPosition } from '../model/scroll-position.model';

export interface ScrollingStrategy {
  scrollDirectionChanged(
    scrollPairChanged: Observable<ScrollPosition[]>
  ): Observable<ScrollPosition[]>;

  scrollRequestZoneChanged(
    scrollDirectionChanged: Observable<ScrollPosition[]>
  ): Observable<ScrollPosition[]>;

  askForUpdate(): void;

  setInitialScrollPosition(): void;

  setPreviousScrollPosition(): void;
}

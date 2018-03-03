import { ScrollPosition } from './model/scroll-position.model';
export declare class NgxInfiniteScrollerUtil {
    static wasScrolledDown(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean;
    static wasScrolledUp(prevPos: ScrollPosition, currentPos: ScrollPosition): boolean;
    static isScrollDownEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean;
    static isScrollUpEnough(pos: ScrollPosition, scrollPositionTrigger: number): boolean;
}

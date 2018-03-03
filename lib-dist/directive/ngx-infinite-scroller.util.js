var NgxInfiniteScrollerUtil = /** @class */ (function () {
    function NgxInfiniteScrollerUtil() {
    }
    NgxInfiniteScrollerUtil.wasScrolledDown = function (prevPos, currentPos) {
        return prevPos.scrollTop < currentPos.scrollTop;
    };
    NgxInfiniteScrollerUtil.wasScrolledUp = function (prevPos, currentPos) {
        return !NgxInfiniteScrollerUtil.wasScrolledDown(prevPos, currentPos);
    };
    NgxInfiniteScrollerUtil.isScrollDownEnough = function (pos, scrollPositionTrigger) {
        return ((pos.scrollTop + pos.clientHeight) / pos.scrollHeight) > (scrollPositionTrigger / 100);
    };
    NgxInfiniteScrollerUtil.isScrollUpEnough = function (pos, scrollPositionTrigger) {
        return (pos.scrollTop / pos.scrollHeight) < (scrollPositionTrigger / 100);
    };
    return NgxInfiniteScrollerUtil;
}());
export { NgxInfiniteScrollerUtil };
//# sourceMappingURL=ngx-infinite-scroller.util.js.map
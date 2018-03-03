var ReverseScrollUtil = /** @class */ (function () {
    function ReverseScrollUtil() {
    }
    ReverseScrollUtil.wasScrolledDown = function (prevPos, currentPos) {
        return prevPos.scrollTop < currentPos.scrollTop;
    };
    ReverseScrollUtil.wasScrolledUp = function (prevPos, currentPos) {
        return !ReverseScrollUtil.wasScrolledDown(prevPos, currentPos);
    };
    ReverseScrollUtil.isScrollDownEnough = function (pos, scrollPositionTrigger) {
        return ((pos.scrollTop + pos.clientHeight) / pos.scrollHeight) > (scrollPositionTrigger / 100);
    };
    ReverseScrollUtil.isScrollUpEnough = function (pos, scrollPositionTrigger) {
        return (pos.scrollTop / pos.scrollHeight) < (scrollPositionTrigger / 100);
    };
    return ReverseScrollUtil;
}());
export { ReverseScrollUtil };
//# sourceMappingURL=ngx-infinite-scroll.util.js.map
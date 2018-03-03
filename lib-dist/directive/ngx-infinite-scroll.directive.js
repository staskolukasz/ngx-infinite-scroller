import { Directive, ElementRef, Input, Output, EventEmitter, Renderer2, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/debounceTime';
import { ReverseScrollUtil } from './ngx-infinite-scroll.util';
import { initialScrollPosition } from './model/scroll-position.model';
var NgxInfiniteScrollDirective = /** @class */ (function () {
    function NgxInfiniteScrollDirective(el, renderer, zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
        this.scrollbarAnimationInterval = 100;
        this.scrollDebounceTimeAfterDOMMutation = 300;
        this.scrollUpPercentilePositionTrigger = 5;
        this.onScrollUp = new EventEmitter();
    }
    Object.defineProperty(NgxInfiniteScrollDirective.prototype, "scrollPositionChanged", {
        get: function () {
            var _this = this;
            if (this.scrollChanged) {
                return this.scrollChanged
                    .takeWhile(function () { return _this.scrollStreamActive; })
                    .map(function (e) {
                    return {
                        scrollHeight: e.target.scrollHeight,
                        scrollTop: e.target.scrollTop,
                        clientHeight: e.target.clientHeight,
                    };
                })
                    .pairwise()
                    .debounceTime(this.scrollbarAnimationInterval);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxInfiniteScrollDirective.prototype, "scrollDownChanged", {
        get: function () {
            return this.scrollPositionChanged
                .filter(function (scrollPositions) {
                return ReverseScrollUtil.wasScrolledDown(scrollPositions[0], scrollPositions[1]);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxInfiniteScrollDirective.prototype, "scrollUpChanged", {
        get: function () {
            return this.scrollPositionChanged
                .filter(function (scrollPositions) {
                return ReverseScrollUtil.wasScrolledUp(scrollPositions[0], scrollPositions[1]);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxInfiniteScrollDirective.prototype, "scrollRequestZoneEntered", {
        get: function () {
            var _this = this;
            return this.scrollUpChanged
                .filter(function (scrollPositions) {
                return ReverseScrollUtil.isScrollUpEnough(scrollPositions[0], _this.scrollUpPercentilePositionTrigger);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxInfiniteScrollDirective.prototype, "requestDispatcher", {
        get: function () {
            var _this = this;
            return this.scrollRequestZoneEntered
                .do(function () {
                _this.previousScrollTop = _this.el.nativeElement.scrollTop;
                _this.previousScrollHeight = _this.el.nativeElement.scrollHeight;
            })
                .startWith([initialScrollPosition, initialScrollPosition]);
        },
        enumerable: true,
        configurable: true
    });
    NgxInfiniteScrollDirective.prototype.ngOnInit = function () {
        this.domMutationEmitter = new Subject();
        this.initMode = true;
        this.scrollStreamActive = false;
        this.registerScrollEventHandler();
        this.registerMutationObserver();
        this.registerInitialScrollPostionHandler();
        this.registerRequestScrollPositionHandler();
    };
    NgxInfiniteScrollDirective.prototype.ngAfterViewInit = function () {
        this.registerRequestDispatcher();
    };
    NgxInfiniteScrollDirective.prototype.ngOnDestroy = function () {
        this.domMutationObserver.disconnect();
    };
    NgxInfiniteScrollDirective.prototype.scrollTo = function (scrollTop) {
        this.scrollStreamActive = false;
        this.renderer.setProperty(this.el.nativeElement, 'scrollTop', scrollTop || this.el.nativeElement.scrollHeight);
        this.scrollStreamActive = true;
    };
    NgxInfiniteScrollDirective.prototype.registerScrollEventHandler = function () {
        this.scrollChanged = Observable.fromEvent(this.el.nativeElement, 'scroll');
    };
    NgxInfiniteScrollDirective.prototype.registerMutationObserver = function () {
        var _this = this;
        this.domMutationObserver = new MutationObserver(function (mutations) {
            _this.domMutationEmitter.next(mutations);
        });
        var config = { attributes: true, childList: true, characterData: true };
        this.domMutationObserver.observe(this.el.nativeElement, config);
    };
    NgxInfiniteScrollDirective.prototype.registerInitialScrollPostionHandler = function () {
        var _this = this;
        this.domMutationEmitter
            .takeWhile(function () { return _this.initMode; })
            .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
            .subscribe(function () {
            _this.scrollTo();
            _this.initMode = false;
        });
    };
    NgxInfiniteScrollDirective.prototype.registerRequestScrollPositionHandler = function () {
        var _this = this;
        Observable
            .zip(this.requestDispatcher, this.domMutationEmitter)
            .skipWhile(function () { return _this.initMode; })
            .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
            .subscribe(function () {
            var newScrollPosition = _this.previousScrollTop +
                (_this.el.nativeElement.scrollHeight - _this.previousScrollHeight);
            _this.scrollTo(newScrollPosition);
        });
    };
    NgxInfiniteScrollDirective.prototype.registerRequestDispatcher = function () {
        var _this = this;
        this.requestDispatcher.subscribe(function () {
            _this.onScrollUp.next();
        });
    };
    NgxInfiniteScrollDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxInfiniteScroll]'
                },] },
    ];
    /** @nocollapse */
    NgxInfiniteScrollDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
        { type: NgZone, },
    ]; };
    NgxInfiniteScrollDirective.propDecorators = {
        'scrollbarAnimationInterval': [{ type: Input },],
        'scrollDebounceTimeAfterDOMMutation': [{ type: Input },],
        'scrollUpPercentilePositionTrigger': [{ type: Input },],
        'onScrollUp': [{ type: Output },],
    };
    return NgxInfiniteScrollDirective;
}());
export { NgxInfiniteScrollDirective };
//# sourceMappingURL=ngx-infinite-scroll.directive.js.map
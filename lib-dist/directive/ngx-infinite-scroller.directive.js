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
import { NgxInfiniteScrollerUtil } from './ngx-infinite-scroller.util';
import { initialScrollPosition } from './model/scroll-position.model';
var NgxInfiniteScrollerDirective = /** @class */ (function () {
    function NgxInfiniteScrollerDirective(el, renderer, zone) {
        this.el = el;
        this.renderer = renderer;
        this.zone = zone;
        this.scrollbarAnimationInterval = 100;
        this.scrollDebounceTimeAfterDOMMutation = 300;
        this.scrollUpPercentilePositionTrigger = 5;
        this.onScrollUp = new EventEmitter();
    }
    Object.defineProperty(NgxInfiniteScrollerDirective.prototype, "scrollPositionChanged", {
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
    Object.defineProperty(NgxInfiniteScrollerDirective.prototype, "scrollDownChanged", {
        get: function () {
            return this.scrollPositionChanged
                .filter(function (scrollPositions) {
                return NgxInfiniteScrollerUtil.wasScrolledDown(scrollPositions[0], scrollPositions[1]);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxInfiniteScrollerDirective.prototype, "scrollUpChanged", {
        get: function () {
            return this.scrollPositionChanged
                .filter(function (scrollPositions) {
                return NgxInfiniteScrollerUtil.wasScrolledUp(scrollPositions[0], scrollPositions[1]);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxInfiniteScrollerDirective.prototype, "scrollRequestZoneEntered", {
        get: function () {
            var _this = this;
            return this.scrollUpChanged
                .filter(function (scrollPositions) {
                return NgxInfiniteScrollerUtil.isScrollUpEnough(scrollPositions[0], _this.scrollUpPercentilePositionTrigger);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxInfiniteScrollerDirective.prototype, "requestDispatcher", {
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
    NgxInfiniteScrollerDirective.prototype.ngOnInit = function () {
        this.domMutationEmitter = new Subject();
        this.initMode = true;
        this.scrollStreamActive = false;
        this.registerScrollEventHandler();
        this.registerMutationObserver();
        this.registerInitialScrollPostionHandler();
        this.registerRequestScrollPositionHandler();
    };
    NgxInfiniteScrollerDirective.prototype.ngAfterViewInit = function () {
        this.registerRequestDispatcher();
    };
    NgxInfiniteScrollerDirective.prototype.ngOnDestroy = function () {
        this.domMutationObserver.disconnect();
    };
    NgxInfiniteScrollerDirective.prototype.scrollTo = function (scrollTop) {
        this.scrollStreamActive = false;
        this.renderer.setProperty(this.el.nativeElement, 'scrollTop', scrollTop || this.el.nativeElement.scrollHeight);
        this.scrollStreamActive = true;
    };
    NgxInfiniteScrollerDirective.prototype.registerScrollEventHandler = function () {
        this.scrollChanged = Observable.fromEvent(this.el.nativeElement, 'scroll');
    };
    NgxInfiniteScrollerDirective.prototype.registerMutationObserver = function () {
        var _this = this;
        this.domMutationObserver = new MutationObserver(function (mutations) {
            _this.domMutationEmitter.next(mutations);
        });
        var config = { attributes: true, childList: true, characterData: true };
        this.domMutationObserver.observe(this.el.nativeElement, config);
    };
    NgxInfiniteScrollerDirective.prototype.registerInitialScrollPostionHandler = function () {
        var _this = this;
        this.domMutationEmitter
            .takeWhile(function () { return _this.initMode; })
            .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
            .subscribe(function () {
            _this.scrollTo();
            _this.initMode = false;
        });
    };
    NgxInfiniteScrollerDirective.prototype.registerRequestScrollPositionHandler = function () {
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
    NgxInfiniteScrollerDirective.prototype.registerRequestDispatcher = function () {
        var _this = this;
        this.requestDispatcher.subscribe(function () {
            _this.onScrollUp.next();
        });
    };
    NgxInfiniteScrollerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxInfiniteScroller]'
                },] },
    ];
    /** @nocollapse */
    NgxInfiniteScrollerDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
        { type: NgZone, },
    ]; };
    NgxInfiniteScrollerDirective.propDecorators = {
        'scrollbarAnimationInterval': [{ type: Input },],
        'scrollDebounceTimeAfterDOMMutation': [{ type: Input },],
        'scrollUpPercentilePositionTrigger': [{ type: Input },],
        'onScrollUp': [{ type: Output },],
    };
    return NgxInfiniteScrollerDirective;
}());
export { NgxInfiniteScrollerDirective };
//# sourceMappingURL=ngx-infinite-scroller.directive.js.map
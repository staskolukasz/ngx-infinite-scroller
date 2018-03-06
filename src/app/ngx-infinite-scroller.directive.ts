import {
  Directive,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';

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

import { DirectiveContext } from './implementation/directive-context';
import { ScrollingTop } from './implementation/scrolling-top';

import { NgxInfiniteScrollerUtil } from './ngx-infinite-scroller.util';

import { ScrollPosition } from './model/scroll-position.model';
import { initialScrollPosition } from './model/scroll-position.model';

@Directive({
  selector: '[ngxInfiniteScroller]'
})
export class NgxInfiniteScrollerDirective
  extends DirectiveContext
  implements AfterViewInit, OnInit, OnDestroy {

  @Input()
  public strategy: string = 'scrollingTop';

  @Input()
  public scrollbarAnimationInterval = 100;

  @Input()
  public scrollDebounceTimeAfterDOMMutation = 300;

  @Input()
  public scrollUpPercentilePositionTrigger = 5;

  @Output()
  public onScrollUp: EventEmitter<null> = new EventEmitter<null>();

  @Output()
  public onScrollDown: EventEmitter<null> = new EventEmitter<null>();

  public previousScrollTop: number;

  public previousScrollHeight: number;

  public scrollStreamActive: boolean;

  private initMode: boolean;

  private domMutationObserver: MutationObserver;

  private domMutationEmitter: Subject<MutationRecord[]>;

  private scrollChanged: Observable<Event>;

  private get scrollPositionChanged(): Observable<ScrollPosition[]> {
    if (this.scrollChanged) {
      return this.scrollingStrategy.scrollPositionChanged(this.scrollChanged);
    }
  }

  // private get scrollDownChanged(): Observable<ScrollPosition[]> {
  //   return this.scrollPositionChanged
  //     .filter((scrollPositions: ScrollPosition[]) => {
  //       return NgxInfiniteScrollerUtil.wasScrolledDown(
  //         scrollPositions[0],
  //         scrollPositions[1]
  //       );
  //     });
  // }

  private get scrollTypeChanged(): Observable<ScrollPosition[]> {
    return this.scrollingStrategy.scrollTypeChanged(this.scrollPositionChanged);
  }

  private get scrollRequestZoneEntered(): Observable<ScrollPosition[]> {
    return this.scrollingStrategy.scrollRequestZoneEntered(this.scrollTypeChanged);
  }

  private get requestDispatcher(): Observable<ScrollPosition[]> {
    return this.scrollingStrategy.requestDispatcher(this.scrollRequestZoneEntered);
  }


  constructor(
    el: ElementRef,
    renderer: Renderer2
  ) {
    super(el, renderer);
    this.scrollingStrategy = new ScrollingTop(this);
  }

  public ngOnInit(): void {
    this.domMutationEmitter = new Subject<MutationRecord[]>();

    this.initMode = true;
    this.scrollStreamActive = false;

    this.registerScrollEventHandler();
    this.registerMutationObserver();
    this.registerInitialScrollPostionHandler();
    this.registerRequestScrollPositionHandler();
  }

  public ngAfterViewInit(): void {
    this.registerRequestDispatcher();
  }

  public ngOnDestroy(): void {
    this.domMutationObserver.disconnect();
  }

  private registerScrollEventHandler(): void {
    this.scrollChanged = Observable.fromEvent(this.el.nativeElement, 'scroll');
  }

  private registerMutationObserver(): void {
    this.domMutationObserver = new MutationObserver(
      (mutations: MutationRecord[]) => {
        this.domMutationEmitter.next(mutations);
      });

    const config = { attributes: true, childList: true, characterData: true };
    this.domMutationObserver.observe(this.el.nativeElement, config);
  }

  private registerInitialScrollPostionHandler(): void {
    this.domMutationEmitter
      .takeWhile(() => this.initMode)
      .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
      .subscribe(() => {
        this.scrollingStrategy.scrollTo();
        this.initMode = false;
      });
  }

  private registerRequestScrollPositionHandler(): void {
    Observable
      .zip(this.requestDispatcher, this.domMutationEmitter)
      .skipWhile(() => this.initMode)
      .debounceTime(this.scrollDebounceTimeAfterDOMMutation)
      .subscribe(() => {
        this.scrollingStrategy.setNewScrollPosition();
      });
  }

  private registerRequestDispatcher(): void {
    this.requestDispatcher.subscribe(() => {
      this.scrollingStrategy.onScroll();
    });
  }
}
